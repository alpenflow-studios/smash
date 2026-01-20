import Link from 'next/link';
import { Smash } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Users, Clock } from 'lucide-react';

interface SmashCardProps {
  smash: Smash;
  onJoin?: () => void;
  onBet?: () => void;
}

export function SmashCard({ smash, onJoin, onBet }: SmashCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      fitness: 'bg-blue-500/10 text-blue-500',
      gaming: 'bg-green-500/10 text-green-500',
      creative: 'bg-pink-500/10 text-pink-500',
      social: 'bg-orange-500/10 text-orange-500',
      other: 'bg-purple-500/10 text-purple-500',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(smash.endsAt);
    const diff = end.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <Card className="border-gray-800 bg-black/50 p-6 hover:border-purple-500 transition-all">
      <div className="mb-4">
        <Badge className={getCategoryColor(smash.category)}>
          {smash.category}
        </Badge>
      </div>

      <Link href={`/smash/${smash.id}`}>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-purple-400 transition cursor-pointer">
          {smash.title}
        </h3>
      </Link>
      
      <div className="space-y-2 text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-2">
          <DollarSign size={16} />
          <span className="text-green-500">
            ${smash.prizePool.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span>
            {smash.participants.length}/{smash.maxParticipants}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>Ends in {getTimeRemaining()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {onJoin && (
          <Button 
            className="flex-1 bg-purple-600 hover:bg-purple-700" 
            onClick={onJoin}
          >
            Join
          </Button>
        )}
        {onBet && smash.bettingEnabled && (
          <Button 
            variant="outline" 
            className="flex-1 border-gray-700 hover:border-purple-500" 
            onClick={onBet}
          >
            Bet
          </Button>
        )}
      </div>
    </Card>
  );
}