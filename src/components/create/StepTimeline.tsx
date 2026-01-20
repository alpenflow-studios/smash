'use client';

import { useCreateSmash } from '@/store/use-create-smash';
import { Button } from '@/components/ui/button';

export function StepTimeline() {
  const { 
    startsAt,
    endsAt,
    verificationWindowHours,
    setStartsAt, 
    setEndsAt,
    setVerificationWindowHours,
    nextStep,
    prevStep,
  } = useCreateSmash();

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const minStartDate = tomorrow.toISOString().slice(0, 16);

  // Get min end date (must be after start)
  const minEndDate = startsAt 
    ? new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) 
    : minStartDate;

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartsAt(date);
    // Reset end date if it's before new start
    if (date && endsAt && endsAt <= date) {
      setEndsAt(null);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndsAt(date);
  };

  const verificationOptions = [
    { hours: 12, label: '12 hours' },
    { hours: 24, label: '24 hours' },
    { hours: 48, label: '48 hours' },
    { hours: 72, label: '72 hours' },
  ];

  const isValid = startsAt && endsAt && endsAt > startsAt;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Timeline</h2>
        <p className="text-gray-400">When does the challenge run?</p>
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Start Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          min={minStartDate}
          value={startsAt ? startsAt.toISOString().slice(0, 16) : ''}
          onChange={handleStartChange}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500">
          When participants can start completing the challenge
        </p>
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          End Date & Time <span className="text-red-500">*</span>
        </label>
        <input
          type="datetime-local"
          min={minEndDate}
          value={endsAt ? endsAt.toISOString().slice(0, 16) : ''}
          onChange={handleEndChange}
          disabled={!startsAt}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500">
          Deadline for completing the challenge
        </p>
      </div>

      {/* Duration Preview */}
      {startsAt && endsAt && (
        <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 animate-in fade-in">
          <div className="text-sm text-gray-400">Challenge Duration</div>
          <div className="text-xl font-bold mt-1">
            {formatDuration(startsAt, endsAt)}
          </div>
        </div>
      )}

      {/* Verification Window */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Proof Submission Window
        </label>
        <div className="grid grid-cols-4 gap-2">
          {verificationOptions.map((option) => (
            <button
              key={option.hours}
              onClick={() => setVerificationWindowHours(option.hours)}
              className={`p-3 rounded-lg border text-center transition-all ${
                verificationWindowHours === option.hours
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          How long after the end time can participants submit proof
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          disabled={!isValid}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function formatDuration(start: Date, end: Date): string {
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (remainingHours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''}, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
  }
}
