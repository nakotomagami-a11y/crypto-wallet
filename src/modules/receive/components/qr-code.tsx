"use client";

import { QRCodeSVG } from "qrcode.react";

interface QrCodeProps {
  value: string;
}

export function QrCode({ value }: QrCodeProps) {
  return (
    <div className="flex items-center justify-center rounded-xl bg-white p-4">
      <QRCodeSVG value={value} size={200} level="M" />
    </div>
  );
}
