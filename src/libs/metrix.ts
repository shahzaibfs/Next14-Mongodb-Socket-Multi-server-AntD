import os from "os";
import netstat from "node-netstat";
import "colors";

class MetrixObserver {
  cpuUsage: any = [];
  totalCPUTime = 0;
  cpuUsagePercentage = [];
  timer = 5000;
  memoryUsage: any;
  networkStates: any[] = [];

  private static instance: MetrixObserver;

  constructor(timer: number) {
    this.timer = timer;
    this.#startMonitoring()
  }
  public static start(timer:number): MetrixObserver {
    if (!MetrixObserver.instance) {
      MetrixObserver.instance = new MetrixObserver(timer);
    }
    return MetrixObserver.instance;
  }
  #monitorCPU() {
    this.cpuUsage = os.cpus().map((cpu) => {
      return (
        cpu.times.user +
        cpu.times.nice +
        cpu.times.sys +
        cpu.times.idle +
        cpu.times.irq
      );
    });

    this.totalCPUTime = this.cpuUsage.reduce(
      (total: number, usage: number) => total + usage,
      0,
    );

    this.cpuUsagePercentage = this.cpuUsage.map(
      (usage: number) => (usage / this.totalCPUTime) * 100,
    );
    const avgUsage =
      this.cpuUsagePercentage.reduce((total: number, usage: number) => {
        return total + usage;
      }, 0) / this.cpuUsagePercentage.length;
    console.log("CPU Usage:", avgUsage);
  }
  #monitorMemory() {
    this.memoryUsage = process.memoryUsage();
    console.log("Memory Usage:", this.memoryUsage);
  }
  #monitorNetwork() {
    netstat(
      {
        filter: {
          local: {
            port: 3001,
          },
        },
      },
      (data) => {
        this.networkStates.push(data);
      },
    );
  }
  #startMonitoring() {
    console.log("Staring the startMonitoring Service".green);
    setInterval(() => {
      this.#monitorCPU();
      this.#monitorMemory();
      this.#monitorNetwork();
    }, this.timer);
  }
}

export default MetrixObserver ;
