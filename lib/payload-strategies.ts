/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface PayloadStrategy {
  name: string;
  detect(json: any): boolean;
  generate(json: any): string;
}

export class WiFiStrategy implements PayloadStrategy {
  name = 'WiFi';

  detect(json: any): boolean {
    return json && (json.ssid || json.SSID) && (json.password || json.PASSWORD);
  }

  generate(json: any): string {
    const ssid = json.ssid || json.SSID || '';
    const password = json.password || json.PASSWORD || '';
    const type = json.type || json.TYPE || 'WPA';
    const hidden = json.hidden || json.HIDDEN ? 'true' : 'false';
    return `WIFI:T:${type};S:${ssid};P:${password};H:${hidden};;`;
  }
}

export class VCardStrategy implements PayloadStrategy {
  name = 'vCard';

  detect(json: any): boolean {
    return json && (json.firstName || json.lastName || json.name) && (json.phone || json.email);
  }

  generate(json: any): string {
    const name = json.name || `${json.firstName || ''} ${json.lastName || ''}`.trim();
    const phone = json.phone || '';
    const email = json.email || '';
    return `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
  }
}

export class EmailStrategy implements PayloadStrategy {
  name = 'Email';

  detect(json: any): boolean {
    return json && json.email && json.subject && !json.phone && !(json.firstName || json.lastName);
  }

  generate(json: any): string {
    return `MATMSG:TO:${json.email};SUB:${json.subject};BODY:${json.body || ''};;`;
  }
}

export class URLStrategy implements PayloadStrategy {
  name = 'URL';

  detect(json: any): boolean {
    return json && Object.keys(json).length === 1 && (json.url || json.URL);
  }

  generate(json: any): string {
    const url = json.url || json.URL;
    return url;
  }
}

export class FallbackStrategy implements PayloadStrategy {
  name = 'JSON';

  detect(json: any): boolean {
    return true;
  }

  generate(json: any): string {
    return JSON.stringify(json);
  }
}
