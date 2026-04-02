"use client";

import { useGasEstimate } from "@/modules/send/hooks/use-gas-estimate";
import type { NetworkId } from "@/types/wallet";

interface GasEstimatorProps {
  network: NetworkId;
  to: string;
}

export function GasEstimator({ network, to }: GasEstimatorProps) {
  const { data, isLoading } = useGasEstimate(network, to);

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--outline-dim)] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M3 22h12"/><path d="M4 9h10"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>
        <span className="text-xs text-muted-foreground">
          Estimated fee
        </span>
      </div>
      <div className="text-right">
        {isLoading ? (
          <span className="text-xs text-muted-foreground">Estimating...</span>
        ) : data ? (
          <div>
            <div className="flex items-center gap-1.5 justify-end">
              <span className="font-mono text-xs font-medium">
                {data.fee} {data.symbol}
              </span>
              {data.feeUsd && (
                <span className="text-[10px] text-muted-foreground">({data.feeUsd})</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">{data.details}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
