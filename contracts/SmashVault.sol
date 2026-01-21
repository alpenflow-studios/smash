// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SmashVault
 * @notice Holds entry fees for smash challenges and distributes payouts to winners
 * @dev Supports ETH and USDC payments
 */
contract SmashVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs
    struct SmashInfo {
        address creator;
        uint256 entryFeeETH;      // Required ETH amount (0 if not accepting ETH)
        uint256 entryFeeUSDC;     // Required USDC amount (0 if not accepting USDC)
        uint256 startTime;        // When the smash starts (refunds blocked after)
        uint256 totalPoolETH;     // Total ETH collected
        uint256 totalPoolUSDC;    // Total USDC collected
        bool isActive;            // Whether smash is accepting participants
        bool payoutComplete;      // Whether payout has been distributed
    }

    struct ParticipantInfo {
        address token;            // Token used (address(0) for ETH)
        uint256 amount;           // Amount paid
        bool refunded;            // Whether participant withdrew
    }

    // State
    IERC20 public immutable usdc;
    address public admin;

    mapping(bytes32 => SmashInfo) public smashes;
    mapping(bytes32 => mapping(address => ParticipantInfo)) public participants;
    mapping(bytes32 => address[]) public participantList;

    // Events
    event SmashCreated(
        bytes32 indexed smashId,
        address indexed creator,
        uint256 entryFeeETH,
        uint256 entryFeeUSDC,
        uint256 startTime
    );

    event ParticipantJoined(
        bytes32 indexed smashId,
        address indexed participant,
        address token,
        uint256 amount
    );

    event ParticipantWithdrew(
        bytes32 indexed smashId,
        address indexed participant,
        address token,
        uint256 amount
    );

    event PayoutDistributed(
        bytes32 indexed smashId,
        uint256 totalETH,
        uint256 totalUSDC
    );

    event SmashCancelled(bytes32 indexed smashId);

    // Errors
    error SmashAlreadyExists();
    error SmashNotFound();
    error SmashNotActive();
    error SmashAlreadyStarted();
    error SmashNotStarted();
    error AlreadyJoined();
    error NotJoined();
    error AlreadyRefunded();
    error InvalidEntryFee();
    error InvalidToken();
    error PayoutAlreadyComplete();
    error InvalidPayoutData();
    error OnlyAdmin();
    error OnlyCreatorOrAdmin();
    error TransferFailed();

    // Modifiers
    modifier onlyAdmin() {
        if (msg.sender != admin) revert OnlyAdmin();
        _;
    }

    modifier onlyCreatorOrAdmin(bytes32 smashId) {
        SmashInfo storage smash = smashes[smashId];
        if (msg.sender != smash.creator && msg.sender != admin) {
            revert OnlyCreatorOrAdmin();
        }
        _;
    }

    constructor(address _usdc, address _admin) {
        usdc = IERC20(_usdc);
        admin = _admin;
    }

    /**
     * @notice Create a new smash challenge
     * @param smashId Unique identifier (typically UUID converted to bytes32)
     * @param entryFeeETH Required ETH amount (set to 0 to not accept ETH)
     * @param entryFeeUSDC Required USDC amount (set to 0 to not accept USDC)
     * @param startTime Unix timestamp when smash starts (refunds blocked after)
     */
    function createSmash(
        bytes32 smashId,
        uint256 entryFeeETH,
        uint256 entryFeeUSDC,
        uint256 startTime
    ) external {
        if (smashes[smashId].creator != address(0)) revert SmashAlreadyExists();
        if (entryFeeETH == 0 && entryFeeUSDC == 0) revert InvalidEntryFee();

        smashes[smashId] = SmashInfo({
            creator: msg.sender,
            entryFeeETH: entryFeeETH,
            entryFeeUSDC: entryFeeUSDC,
            startTime: startTime,
            totalPoolETH: 0,
            totalPoolUSDC: 0,
            isActive: true,
            payoutComplete: false
        });

        emit SmashCreated(smashId, msg.sender, entryFeeETH, entryFeeUSDC, startTime);
    }

    /**
     * @notice Join a smash with ETH
     * @param smashId The smash to join
     */
    function joinWithETH(bytes32 smashId) external payable nonReentrant {
        SmashInfo storage smash = smashes[smashId];

        if (smash.creator == address(0)) revert SmashNotFound();
        if (!smash.isActive) revert SmashNotActive();
        if (smash.entryFeeETH == 0) revert InvalidToken();
        if (msg.value != smash.entryFeeETH) revert InvalidEntryFee();
        if (participants[smashId][msg.sender].amount > 0) revert AlreadyJoined();

        participants[smashId][msg.sender] = ParticipantInfo({
            token: address(0),
            amount: msg.value,
            refunded: false
        });
        participantList[smashId].push(msg.sender);
        smash.totalPoolETH += msg.value;

        emit ParticipantJoined(smashId, msg.sender, address(0), msg.value);
    }

    /**
     * @notice Join a smash with USDC
     * @param smashId The smash to join
     * @param amount USDC amount (must match entry fee)
     */
    function joinWithUSDC(bytes32 smashId, uint256 amount) external nonReentrant {
        SmashInfo storage smash = smashes[smashId];

        if (smash.creator == address(0)) revert SmashNotFound();
        if (!smash.isActive) revert SmashNotActive();
        if (smash.entryFeeUSDC == 0) revert InvalidToken();
        if (amount != smash.entryFeeUSDC) revert InvalidEntryFee();
        if (participants[smashId][msg.sender].amount > 0) revert AlreadyJoined();

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        participants[smashId][msg.sender] = ParticipantInfo({
            token: address(usdc),
            amount: amount,
            refunded: false
        });
        participantList[smashId].push(msg.sender);
        smash.totalPoolUSDC += amount;

        emit ParticipantJoined(smashId, msg.sender, address(usdc), amount);
    }

    /**
     * @notice Withdraw and get refund before smash starts
     * @param smashId The smash to withdraw from
     */
    function withdrawBeforeStart(bytes32 smashId) external nonReentrant {
        SmashInfo storage smash = smashes[smashId];
        ParticipantInfo storage participant = participants[smashId][msg.sender];

        if (smash.creator == address(0)) revert SmashNotFound();
        if (block.timestamp >= smash.startTime) revert SmashAlreadyStarted();
        if (participant.amount == 0) revert NotJoined();
        if (participant.refunded) revert AlreadyRefunded();

        participant.refunded = true;
        uint256 refundAmount = participant.amount;
        address refundToken = participant.token;

        if (refundToken == address(0)) {
            // ETH refund
            smash.totalPoolETH -= refundAmount;
            (bool success, ) = msg.sender.call{value: refundAmount}("");
            if (!success) revert TransferFailed();
        } else {
            // USDC refund
            smash.totalPoolUSDC -= refundAmount;
            usdc.safeTransfer(msg.sender, refundAmount);
        }

        emit ParticipantWithdrew(smashId, msg.sender, refundToken, refundAmount);
    }

    /**
     * @notice Distribute payout to winners
     * @param smashId The smash to distribute
     * @param winners Array of winner addresses
     * @param shares Array of shares (must sum to 10000 for 100%)
     */
    function distributePayout(
        bytes32 smashId,
        address[] calldata winners,
        uint256[] calldata shares
    ) external onlyAdmin nonReentrant {
        SmashInfo storage smash = smashes[smashId];

        if (smash.creator == address(0)) revert SmashNotFound();
        if (smash.payoutComplete) revert PayoutAlreadyComplete();
        if (winners.length != shares.length) revert InvalidPayoutData();
        if (winners.length == 0) revert InvalidPayoutData();

        // Verify shares sum to 10000 (100%)
        uint256 totalShares;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares += shares[i];
        }
        if (totalShares != 10000) revert InvalidPayoutData();

        smash.payoutComplete = true;
        smash.isActive = false;

        uint256 totalETH = smash.totalPoolETH;
        uint256 totalUSDC = smash.totalPoolUSDC;

        // Distribute to winners
        for (uint256 i = 0; i < winners.length; i++) {
            if (totalETH > 0) {
                uint256 ethPayout = (totalETH * shares[i]) / 10000;
                if (ethPayout > 0) {
                    (bool success, ) = winners[i].call{value: ethPayout}("");
                    if (!success) revert TransferFailed();
                }
            }
            if (totalUSDC > 0) {
                uint256 usdcPayout = (totalUSDC * shares[i]) / 10000;
                if (usdcPayout > 0) {
                    usdc.safeTransfer(winners[i], usdcPayout);
                }
            }
        }

        emit PayoutDistributed(smashId, totalETH, totalUSDC);
    }

    /**
     * @notice Cancel a smash and allow all participants to withdraw
     * @param smashId The smash to cancel
     */
    function cancelSmash(bytes32 smashId) external onlyCreatorOrAdmin(smashId) {
        SmashInfo storage smash = smashes[smashId];

        if (smash.creator == address(0)) revert SmashNotFound();
        if (smash.payoutComplete) revert PayoutAlreadyComplete();

        smash.isActive = false;

        // Refund all participants who haven't been refunded
        address[] memory pList = participantList[smashId];
        for (uint256 i = 0; i < pList.length; i++) {
            ParticipantInfo storage participant = participants[smashId][pList[i]];
            if (!participant.refunded && participant.amount > 0) {
                participant.refunded = true;
                if (participant.token == address(0)) {
                    smash.totalPoolETH -= participant.amount;
                    (bool success, ) = pList[i].call{value: participant.amount}("");
                    if (!success) revert TransferFailed();
                } else {
                    smash.totalPoolUSDC -= participant.amount;
                    usdc.safeTransfer(pList[i], participant.amount);
                }
            }
        }

        emit SmashCancelled(smashId);
    }

    // View functions
    function getSmash(bytes32 smashId) external view returns (
        address creator,
        uint256 entryFeeETH,
        uint256 entryFeeUSDC,
        uint256 startTime,
        uint256 totalPoolETH,
        uint256 totalPoolUSDC,
        bool isActive,
        bool payoutComplete
    ) {
        SmashInfo storage smash = smashes[smashId];
        return (
            smash.creator,
            smash.entryFeeETH,
            smash.entryFeeUSDC,
            smash.startTime,
            smash.totalPoolETH,
            smash.totalPoolUSDC,
            smash.isActive,
            smash.payoutComplete
        );
    }

    function getParticipant(bytes32 smashId, address participant) external view returns (
        address token,
        uint256 amount,
        bool refunded
    ) {
        ParticipantInfo storage p = participants[smashId][participant];
        return (p.token, p.amount, p.refunded);
    }

    function hasJoined(bytes32 smashId, address participant) external view returns (bool) {
        return participants[smashId][participant].amount > 0 &&
               !participants[smashId][participant].refunded;
    }

    function getParticipantCount(bytes32 smashId) external view returns (uint256) {
        uint256 count;
        address[] memory pList = participantList[smashId];
        for (uint256 i = 0; i < pList.length; i++) {
            if (!participants[smashId][pList[i]].refunded) {
                count++;
            }
        }
        return count;
    }

    // Admin functions
    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    // Allow contract to receive ETH
    receive() external payable {}
}
