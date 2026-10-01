"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function CertificateDownloadButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="electric"
      size="sm"
      onClick={handlePrint}
      className="font-mono text-xs gap-1.5 cursor-pointer shadow-md"
    >
      <Download className="w-3.5 h-3.5" />
      <span>Download PDF</span>
    </Button>
  );
}
