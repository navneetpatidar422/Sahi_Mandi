import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

export interface PriceHistoryRow {
  mandiId: string;
  mandiName: string;
  location: string;
  cropId: string;
  cropName: string;
  category: string;
  date: string;
  day: string;
  price: number;
}

export interface TodaySummaryRow {
  mandiId: string;
  mandiName: string;
  cropId: string;
  cropName: string;
  todayPrice: number;
  weekAgoPrice: number;
  changePct: number;
}

interface PriceWorkbookData {
  priceHistory: PriceHistoryRow[];
  todaySummary: TodaySummaryRow[];
}

let cachedData: PriceWorkbookData | null = null;
let cachedPromise: Promise<PriceWorkbookData> | null = null;

async function loadPriceWorkbook(): Promise<PriceWorkbookData> {
  if (cachedData) return cachedData;
  if (cachedPromise) return cachedPromise;

  cachedPromise = fetch('/mandi_price_history.xlsx')
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch Excel file: ${res.status}`);
      }
      const buffer = await res.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });

      const priceHistory = XLSX.utils.sheet_to_json<PriceHistoryRow>(workbook.Sheets.PriceHistory ?? {});
      const todaySummary = XLSX.utils.sheet_to_json<TodaySummaryRow>(workbook.Sheets.TodaySummary ?? {});

      cachedData = { priceHistory, todaySummary };
      return cachedData;
    })
    .finally(() => {
      cachedPromise = null;
    });

  return cachedPromise;
}

export function usePriceHistory() {
  const [data, setData] = useState<PriceWorkbookData | null>(cachedData);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      setLoading(false);
      return;
    }

    let cancelled = false;
    loadPriceWorkbook()
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load Excel data');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

export function getMandiCropHistory(
  data: PriceWorkbookData | null,
  mandiId: string,
  cropId: string
) {
  if (!data) return [];
  return data.priceHistory
    .filter((row) => row.mandiId === mandiId && row.cropId === cropId)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => ({
      day: row.day,
      date: row.date,
      price: Number(row.price)
    }));
}

export function getMandiTodayPrices(data: PriceWorkbookData | null, mandiId: string) {
  if (!data) return [];
  return data.todaySummary
    .filter((row) => row.mandiId === mandiId)
    .map((row) => ({
      cropId: row.cropId,
      cropName: row.cropName,
      todayPrice: Number(row.todayPrice),
      weekAgoPrice: Number(row.weekAgoPrice),
      changePct: Number(row.changePct)
    }));
}

export function getCropComparison(data: PriceWorkbookData | null, mandiId: string) {
  if (!data) return [];
  return getMandiTodayPrices(data, mandiId).map((row) => ({
    cropId: row.cropId,
    cropName: row.cropName,
    todayPrice: row.todayPrice,
    weekAgoPrice: row.weekAgoPrice
  }));
}
