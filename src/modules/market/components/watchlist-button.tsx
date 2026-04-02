"use client";

import { useWatchlist } from "@/modules/market/hooks/use-watchlist";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WatchlistButtonProps {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export function WatchlistButton({ id, name, symbol, thumb }: WatchlistButtonProps) {
  const { isWatched, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const watched = isWatched(id);

  function handleToggle() {
    if (watched) {
      removeFromWatchlist(id);
      toast.success(`Removed ${symbol} from watchlist`);
    } else {
      addToWatchlist({ id, name, symbol, thumb });
      toast.success(`Added ${symbol} to watchlist`);
    }
  }

  return (
    <Button
      variant={watched ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={watched ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {watched ? "Watching" : "Watch"}
    </Button>
  );
}
