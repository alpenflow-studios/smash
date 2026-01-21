export const smashVaultAbi = [
  // Events
  {
    type: 'event',
    name: 'SmashCreated',
    inputs: [
      { name: 'smashId', type: 'bytes32', indexed: true },
      { name: 'creator', type: 'address', indexed: true },
      { name: 'entryFeeETH', type: 'uint256', indexed: false },
      { name: 'entryFeeUSDC', type: 'uint256', indexed: false },
      { name: 'startTime', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ParticipantJoined',
    inputs: [
      { name: 'smashId', type: 'bytes32', indexed: true },
      { name: 'participant', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ParticipantWithdrew',
    inputs: [
      { name: 'smashId', type: 'bytes32', indexed: true },
      { name: 'participant', type: 'address', indexed: true },
      { name: 'token', type: 'address', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'PayoutDistributed',
    inputs: [
      { name: 'smashId', type: 'bytes32', indexed: true },
      { name: 'totalETH', type: 'uint256', indexed: false },
      { name: 'totalUSDC', type: 'uint256', indexed: false },
    ],
  },

  // Read functions
  {
    type: 'function',
    name: 'getSmash',
    stateMutability: 'view',
    inputs: [{ name: 'smashId', type: 'bytes32' }],
    outputs: [
      { name: 'creator', type: 'address' },
      { name: 'entryFeeETH', type: 'uint256' },
      { name: 'entryFeeUSDC', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'totalPoolETH', type: 'uint256' },
      { name: 'totalPoolUSDC', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
      { name: 'payoutComplete', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'getParticipant',
    stateMutability: 'view',
    inputs: [
      { name: 'smashId', type: 'bytes32' },
      { name: 'participant', type: 'address' },
    ],
    outputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'refunded', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'hasJoined',
    stateMutability: 'view',
    inputs: [
      { name: 'smashId', type: 'bytes32' },
      { name: 'participant', type: 'address' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'usdc',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
  {
    type: 'function',
    name: 'admin',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },

  // Write functions
  {
    type: 'function',
    name: 'createSmash',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'smashId', type: 'bytes32' },
      { name: 'entryFeeETH', type: 'uint256' },
      { name: 'entryFeeUSDC', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'joinWithETH',
    stateMutability: 'payable',
    inputs: [{ name: 'smashId', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'joinWithUSDC',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'smashId', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'withdrawBeforeStart',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'smashId', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'distributePayout',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'smashId', type: 'bytes32' },
      { name: 'winners', type: 'address[]' },
      { name: 'shares', type: 'uint256[]' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'cancelSmash',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'smashId', type: 'bytes32' }],
    outputs: [],
  },
] as const;
