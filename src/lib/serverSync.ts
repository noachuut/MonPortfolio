import { applyPortfolioSnapshot, normalizePortfolioSnapshot } from "@/lib/portfolioSnapshot";
import { loadServerDataVersion } from "@/lib/portfolioStorage";
import type { PortfolioSnapshot } from "@/lib/portfolioSnapshot";

const SERVER_DATA_URL = "/data/portfolio-data.json";

type SyncStatus = "missing" | "up-to-date" | "updated";

export type SyncResult = {
  status: SyncStatus;
  snapshot?: PortfolioSnapshot;
};

const isBrowser = typeof window !== "undefined";

export const syncServerData = async (): Promise<SyncResult> => {
  if (!isBrowser) {
    return { status: "missing" };
  }

  try {
    const response = await fetch(SERVER_DATA_URL, { cache: "no-store" });

    if (response.status === 404) {
      return { status: "missing" };
    }

    if (!response.ok) {
      throw new Error(`Impossible de récupérer ${SERVER_DATA_URL}: ${response.status}`);
    }

    const payload = await response.json();
    const snapshot = normalizePortfolioSnapshot(payload);

    if (!snapshot) {
      throw new Error("Le fichier JSON de contenu personnalisé est invalide");
    }

    const currentVersion = loadServerDataVersion();

    if (currentVersion === snapshot.version) {
      return { status: "up-to-date", snapshot };
    }

    applyPortfolioSnapshot(snapshot);

    return { status: "updated", snapshot };
  } catch (error) {
    console.error("Synchronisation des données impossible", error);
    throw error;
  }
};
