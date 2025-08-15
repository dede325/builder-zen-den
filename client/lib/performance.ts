// Performance monitoring and optimization utilities for Clínica Bem Cuidar
// Angola-specific optimizations and monitoring

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export interface PageLoadMetrics {
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay?: number;
  cumulativeLayoutShift: number;
}

// Web Vitals thresholds
export const VITALS_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;

  constructor() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    try {
      // Monitor LCP (Largest Contentful Paint)
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            this.metrics.lcp = entry.startTime;
            this.reportMetric("LCP", entry.startTime);
          }
        }
      });

      this.observer.observe({ entryTypes: ["largest-contentful-paint"] });

      // Monitor FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            this.metrics.fid = (entry as any).processingStart - entry.startTime;
            this.reportMetric("FID", this.metrics.fid);
          }
        }
      });

      fidObserver.observe({ entryTypes: ["first-input"] });

      // Monitor CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            entry.entryType === "layout-shift" &&
            !(entry as any).hadRecentInput
          ) {
            clsValue += (entry as any).value;
            this.metrics.cls = clsValue;
          }
        }
        this.reportMetric("CLS", clsValue);
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // Monitor Navigation Timing
      this.monitorNavigationTiming();

      this.isMonitoring = true;
      console.log("[Performance] Monitoring initialized");
    } catch (error) {
      console.error("[Performance] Failed to initialize monitoring:", error);
    }
  }

  private monitorNavigationTiming() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType(
          "navigation",
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const metrics = {
            ttfb: navigation.responseStart - navigation.requestStart,
            domContentLoaded:
              navigation.domContentLoadedEventEnd - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart,
            domInteractive:
              navigation.domInteractive - navigation.navigationStart,
            domComplete: navigation.domComplete - navigation.navigationStart,
          };

          this.metrics.ttfb = metrics.ttfb;

          console.log("[Performance] Navigation metrics:", metrics);
          this.reportNavigationMetrics(metrics);
        }
      }, 0);
    });
  }

  private reportMetric(name: string, value: number) {
    const threshold =
      VITALS_THRESHOLDS[name.toLowerCase() as keyof typeof VITALS_THRESHOLDS];
    const status = this.getMetricStatus(value, threshold);

    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms (${status})`);

    // Send to analytics in production
    if (typeof gtag !== "undefined") {
      gtag("event", "web_vitals", {
        metric_name: name,
        metric_value: Math.round(value),
        metric_status: status,
      });
    }

    // Send to custom analytics endpoint
    this.sendToAnalytics(name, value, status);
  }

  private reportNavigationMetrics(metrics: any) {
    console.log("[Performance] Page load metrics:", metrics);

    // Send to analytics
    if (typeof gtag !== "undefined") {
      gtag("event", "page_load_timing", {
        ttfb: Math.round(metrics.ttfb),
        dom_content_loaded: Math.round(metrics.domContentLoaded),
        load_complete: Math.round(metrics.loadComplete),
      });
    }
  }

  private getMetricStatus(
    value: number,
    threshold?: { good: number; needsImprovement: number },
  ) {
    if (!threshold) return "unknown";

    if (value <= threshold.good) return "good";
    if (value <= threshold.needsImprovement) return "needs-improvement";
    return "poor";
  }

  private async sendToAnalytics(metric: string, value: number, status: string) {
    try {
      // Only send in production and with user consent
      if (process.env.NODE_ENV === "production" && navigator.onLine) {
        await fetch("/api/analytics/performance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            metric,
            value: Math.round(value),
            status,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            connection:
              (navigator as any).connection?.effectiveType || "unknown",
            url: window.location.href,
            referrer: document.referrer,
          }),
        });
      }
    } catch (error) {
      console.warn("[Performance] Failed to send analytics:", error);
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getPageLoadMetrics(): PageLoadMetrics | null {
    if (typeof window === "undefined") return null;

    try {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      if (!navigation) return null;

      const firstPaint =
        paint.find((entry) => entry.name === "first-paint")?.startTime || 0;
      const firstContentfulPaint =
        paint.find((entry) => entry.name === "first-contentful-paint")
          ?.startTime || 0;

      return {
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint,
        firstContentfulPaint,
        largestContentfulPaint: this.metrics.lcp || 0,
        firstInputDelay: this.metrics.fid,
        cumulativeLayoutShift: this.metrics.cls || 0,
      };
    } catch (error) {
      console.error("[Performance] Failed to get page load metrics:", error);
      return null;
    }
  }

  public disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.isMonitoring = false;
    }
  }
}

// Image optimization utilities
export class ImageOptimizer {
  private static loadedImages = new Set<string>();
  private static imageCache = new Map<string, HTMLImageElement>();

  static preloadCriticalImages(urls: string[]) {
    urls.forEach((url) => this.preloadImage(url));
  }

  static preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(url)) {
      return Promise.resolve(this.imageCache.get(url)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(url, img);
        this.loadedImages.add(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static async lazyLoadImages() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove("lazy");
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  static getOptimizedImageUrl(
    url: string,
    width?: number,
    quality = 80,
  ): string {
    // For Unsplash images
    if (url.includes("unsplash.com")) {
      const params = new URLSearchParams();
      if (width) params.set("w", width.toString());
      params.set("q", quality.toString());
      params.set("auto", "format");
      return `${url}&${params.toString()}`;
    }

    // For other CDNs, implement similar logic
    return url;
  }
}

// Resource loading optimization
export class ResourceLoader {
  private static prefetchedResources = new Set<string>();

  static prefetchResource(
    url: string,
    type: "script" | "style" | "image" | "fetch" = "fetch",
  ) {
    if (this.prefetchedResources.has(url)) return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.as = type;
    link.href = url;

    document.head.appendChild(link);
    this.prefetchedResources.add(url);
  }

  static preloadResource(
    url: string,
    type: "script" | "style" | "image" | "fetch" | "font" = "fetch",
  ) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = type;
    link.href = url;

    if (type === "font") {
      link.crossOrigin = "anonymous";
    }

    document.head.appendChild(link);
  }

  static async loadScriptAsync(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

// Connection quality monitoring
export class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private connectionType: string = "unknown";
  private effectiveType: string = "unknown";
  private downlink: number = 0;
  private rtt: number = 0;

  static getInstance(): ConnectionMonitor {
    if (!this.instance) {
      this.instance = new ConnectionMonitor();
    }
    return this.instance;
  }

  constructor() {
    this.initializeConnectionMonitoring();
  }

  private initializeConnectionMonitoring() {
    if ("navigator" in window && "connection" in navigator) {
      const connection = (navigator as any).connection;

      this.updateConnectionInfo(connection);

      connection.addEventListener("change", () => {
        this.updateConnectionInfo(connection);
      });
    }
  }

  private updateConnectionInfo(connection: any) {
    this.connectionType = connection.type || "unknown";
    this.effectiveType = connection.effectiveType || "unknown";
    this.downlink = connection.downlink || 0;
    this.rtt = connection.rtt || 0;

    console.log("[Connection] Updated:", {
      type: this.connectionType,
      effectiveType: this.effectiveType,
      downlink: this.downlink,
      rtt: this.rtt,
    });

    // Adapt content based on connection
    this.adaptToConnection();
  }

  private adaptToConnection() {
    const isSlowConnection =
      this.effectiveType === "slow-2g" ||
      this.effectiveType === "2g" ||
      this.downlink < 1;

    if (isSlowConnection) {
      // Disable auto-playing videos
      document.querySelectorAll("video[autoplay]").forEach((video) => {
        (video as HTMLVideoElement).autoplay = false;
      });

      // Reduce image quality
      document.querySelectorAll("img").forEach((img) => {
        const src = img.src;
        if (src.includes("unsplash.com") && !src.includes("&q=")) {
          img.src = ImageOptimizer.getOptimizedImageUrl(src, undefined, 60);
        }
      });

      // Notify user about slow connection
      this.notifySlowConnection();
    }
  }

  private notifySlowConnection() {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-lg text-sm z-50";
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>Conexão lenta detectada. Conteúdo otimizado.</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-2 font-bold">×</button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  public getConnectionInfo() {
    return {
      type: this.connectionType,
      effectiveType: this.effectiveType,
      downlink: this.downlink,
      rtt: this.rtt,
      isSlowConnection:
        this.effectiveType === "slow-2g" ||
        this.effectiveType === "2g" ||
        this.downlink < 1,
    };
  }
}

// Bundle size monitoring
export class BundleAnalyzer {
  private static chunks = new Map<string, number>();

  static trackChunkLoad(chunkName: string, size: number) {
    this.chunks.set(chunkName, size);
    console.log(
      `[Bundle] Loaded chunk: ${chunkName} (${(size / 1024).toFixed(2)}KB)`,
    );
  }

  static getTotalBundleSize(): number {
    return Array.from(this.chunks.values()).reduce(
      (total, size) => total + size,
      0,
    );
  }

  static getChunkSizes(): Map<string, number> {
    return new Map(this.chunks);
  }
}

// Main performance manager
export class PerformanceManager {
  private static instance: PerformanceManager;
  private monitor: PerformanceMonitor;
  private connectionMonitor: ConnectionMonitor;

  static getInstance(): PerformanceManager {
    if (!this.instance) {
      this.instance = new PerformanceManager();
    }
    return this.instance;
  }

  constructor() {
    this.monitor = new PerformanceMonitor();
    this.connectionMonitor = ConnectionMonitor.getInstance();
    this.initializeOptimizations();
  }

  private initializeOptimizations() {
    // Preload critical resources
    ResourceLoader.preloadResource("/fonts/inter-var.woff2", "font");

    // Initialize lazy loading
    ImageOptimizer.lazyLoadImages();

    // Preload critical images
    const criticalImages = [
      "/icons/icon-192x192.png",
      "/images/clinic-logo.webp",
    ];
    ImageOptimizer.preloadCriticalImages(criticalImages);

    console.log("[Performance] Performance manager initialized");
  }

  public async generatePerformanceReport(): Promise<any> {
    const metrics = this.monitor.getMetrics();
    const pageMetrics = this.monitor.getPageLoadMetrics();
    const connection = this.connectionMonitor.getConnectionInfo();
    const bundleSize = BundleAnalyzer.getTotalBundleSize();

    return {
      webVitals: metrics,
      pageLoad: pageMetrics,
      connection,
      bundleSize: (bundleSize / 1024).toFixed(2) + "KB",
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
  }

  public getRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.monitor.getMetrics();
    const connection = this.connectionMonitor.getConnectionInfo();

    if (metrics.lcp && metrics.lcp > VITALS_THRESHOLDS.lcp.needsImprovement) {
      recommendations.push(
        "Optimize Largest Contentful Paint - consider image optimization and server response times",
      );
    }

    if (metrics.fid && metrics.fid > VITALS_THRESHOLDS.fid.needsImprovement) {
      recommendations.push(
        "Reduce First Input Delay - minimize JavaScript execution time",
      );
    }

    if (metrics.cls && metrics.cls > VITALS_THRESHOLDS.cls.needsImprovement) {
      recommendations.push(
        "Improve Cumulative Layout Shift - specify image dimensions and avoid dynamic content injection",
      );
    }

    if (connection.isSlowConnection) {
      recommendations.push(
        "Optimize for slow connections - implement adaptive loading and reduce bundle size",
      );
    }

    return recommendations;
  }
}

// Initialize performance monitoring
export const performanceManager = PerformanceManager.getInstance();

// Export utilities
export {
  PerformanceMonitor,
  ImageOptimizer,
  ResourceLoader,
  ConnectionMonitor,
  BundleAnalyzer,
};

console.log("[Performance] Performance utilities loaded");
