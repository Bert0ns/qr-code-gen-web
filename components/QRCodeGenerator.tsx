'use client';

import React, { useState, useMemo, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRParser } from '@/lib/qr-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const parser = new QRParser();

export default function QRCodeGenerator() {
  const [jsonInput, setJsonInput] = useState(
    '{\n  "ticketCode": "24869",\n  "destination": "MILANO GRECO PIRELLI" \n}'
  );
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const qrRef = useRef<SVGSVGElement>(null);

  const parsed = useMemo(() => parser.parse(jsonInput), [jsonInput]);

  const formatJson = (text: string) => {
    try {
      if (!text.trim()) return text;
      const parsedData = JSON.parse(text);
      return JSON.stringify(parsedData, null, 2);
    } catch {
      return text;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => setLogoUrl(null);

  const downloadSVG = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPNG = () => {
    if (!qrRef.current) return;
    const svgData = new XMLSerializer().serializeToString(qrRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Scale up for high resolution
    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngFile = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = pngFile;
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-muted-foreground">Smart JSON parsing and rendering</p>
        </div>
        <ThemeToggle />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Config */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="flex-1 shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Data Input</CardTitle>
              <CardDescription>
                Paste your JSON payload below. We&apos;ll try to detect known structures.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Textarea
                  className="font-mono min-h-[240px] resize-y"
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  onBlur={() => setJsonInput(formatJson(jsonInput))}
                  onPaste={() => setTimeout(() => setJsonInput((prev) => formatJson(prev)), 50)}
                  placeholder={'{\n  "url": "https://example.com"\n}'}
                />
                <AnimatePresence>
                  {parsed.error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-4 right-4 flex items-center gap-2 text-destructive bg-destructive/10 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Invalid JSON
                    </motion.div>
                  )}
                  {!parsed.error && parsed.name !== 'Empty' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-4 right-4 flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Detected: {parsed.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="logo">Logo</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fgColor">Foreground Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="fgColor"
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bgColor">Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bgColor"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logo" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Center Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label
                          htmlFor="logo-upload"
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </Label>
                      </div>
                      {logoUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeLogo}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                      Logos work best with Error Correction Level H.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Error Correction Level</Label>
                    <Select
                      value={level}
                      onValueChange={(v) => {
                        if (v) setLevel(v as 'L' | 'M' | 'Q' | 'H');
                      }}
                    >
                      <SelectTrigger className="w-fit min-w-max">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="min-w-max">
                        <SelectItem value="L">Low (7%) - Best for small URLs</SelectItem>
                        <SelectItem value="M">Medium (15%) - Standard</SelectItem>
                        <SelectItem value="Q">Quartile (25%) - Good for readability</SelectItem>
                        <SelectItem value="H">High (30%) - Best for logos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-8 flex flex-col gap-6">
            <Card className="overflow-hidden border-border/50 shadow-xl bg-gradient-to-b from-card to-muted/20">
              <CardHeader className="border-b bg-card/40 backdrop-blur-sm">
                <CardTitle className="flex justify-between items-center">
                  <span>Preview</span>
                  {parsed.name !== 'Error' && (
                    <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {parsed.payload.length} chars
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                <AnimatePresence mode="wait">
                  {parsed.error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center text-muted-foreground text-center"
                    >
                      <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                      <p>Fix JSON errors to generate QR code</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative p-4 bg-white rounded-xl shadow-sm ring-1 ring-black/5"
                    >
                      <QRCodeSVG
                        value={parsed.payload || ' '}
                        size={280}
                        bgColor={bgColor}
                        fgColor={fgColor}
                        level={level}
                        includeMargin={false}
                        imageSettings={
                          logoUrl
                            ? {
                                src: logoUrl,
                                x: undefined,
                                y: undefined,
                                height: 60,
                                width: 60,
                                excavate: true,
                              }
                            : undefined
                        }
                        ref={qrRef}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <div className="bg-card/40 backdrop-blur-sm p-4 border-t flex gap-3">
                <Button
                  className="flex-1"
                  onClick={downloadPNG}
                  disabled={!!parsed.error || !parsed.payload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={downloadSVG}
                  disabled={!!parsed.error || !parsed.payload}
                >
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
