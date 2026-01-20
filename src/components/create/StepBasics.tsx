'use client';

import { useCreateSmash } from '@/store/use-create-smash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 'fitness', label: '🏃 Fitness', description: 'Running, gym, sports' },
  { id: 'gaming', label: '🎮 Gaming', description: 'Competitions, speedruns' },
  { id: 'creative', label: '🎨 Creative', description: 'Art, music, content' },
  { id: 'social', label: '🤝 Social', description: 'Challenges with friends' },
  { id: 'other', label: '✨ Other', description: 'Anything goes' },
] as const;

export function StepBasics() {
  const { 
    title, 
    description, 
    category, 
    coverImagePreview,
    setTitle, 
    setDescription, 
    setCategory,
    setCoverImage,
    nextStep 
  } = useCreateSmash();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setCoverImage(file, preview);
    }
  };

  const isValid = title.trim().length >= 3;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Create Your Smash</h2>
        <p className="text-gray-400">What challenge do you want to complete?</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Run a 5K in under 25 minutes"
          className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
        />
        <p className="text-xs text-gray-500">Make it specific and measurable</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details, rules, or context for your challenge..."
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                category === cat.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <div className="font-medium">{cat.label}</div>
              <div className="text-xs text-gray-500">{cat.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Cover Image</label>
        <div className="flex items-center gap-4">
          {coverImagePreview ? (
            <div className="relative">
              <img 
                src={coverImagePreview} 
                alt="Cover preview" 
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => setCoverImage(null, null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-sm"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="w-24 h-24 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-600 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-gray-500 text-2xl">+</span>
            </label>
          )}
          <p className="text-xs text-gray-500">Optional. JPG, PNG up to 5MB</p>
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-4">
        <Button
          onClick={nextStep}
          disabled={!isValid}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
