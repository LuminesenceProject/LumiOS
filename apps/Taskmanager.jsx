import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from '../../util/useLocalStorage';
import apps from "../apps/Apps.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faGaugeHigh, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { faAppStore } from '@fortawesome/free-brands-svg-icons';

const BenchmarkContent = () => {
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [selectedBenchmark, setSelectedBenchmark] = useState('Benchmark1');
  const [chartData, setChartData] = useState([]);
  const [benchmarkRuns, setBenchmarkRuns] = useState(1);
  const [userFunction, setUserFunction] = useState('');
  const [error, setError] = useState(null);

  const benchmarks = {
    Benchmark1: {
      label: 'Benchmark 1 (Prime Numbers)',
      script: () => {
        // Sieve of Eratosthenes algorithm to find prime numbers up to a certain limit
        const sieveOfEratosthenes = (limit) => {
          const primes = [];
          const isPrime = new Array(limit + 1).fill(true);

          for (let number = 2; number <= limit; number++) {
            if (isPrime[number]) {
              primes.push(number);

              for (let i = number * number; i <= limit; i += number) {
                isPrime[i] = false;
              }
            }
          }

          return primes;
        };

        // Run the algorithm to find primes up to 100,000
        const startTime = performance.now();
        for (let i = 0; i < benchmarkRuns; i++) {
          sieveOfEratosthenes(100000);
        }
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return executionTime;
      },
    },
    Benchmark2: {
      label: 'Benchmark 2 (Triangle Vector Math)',
      script: () => {
        // Complex triangle math: Vector operations
        const calculateTriangleArea = (a, b, c) => {
          const triangles = [];
          const randomVector = () => ({
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
          });

          for (let i = 0; i < 10000; i++) {
            const vectorA = randomVector();
            const vectorB = randomVector();
            const vectorC = randomVector();

            // Cross product of two vectors
            const crossProduct = {
              x: vectorA.y * vectorB.z - vectorA.z * vectorB.y,
              y: vectorA.z * vectorB.x - vectorA.x * vectorB.z,
              z: vectorA.x * vectorB.y - vectorA.y * vectorB.x,
            };

            // Magnitude of the cross product
            const magnitude = Math.sqrt(
              crossProduct.x ** 2 + crossProduct.y ** 2 + crossProduct.z ** 2
            );

            // Area of the triangle formed by the three vectors
            const area = 0.5 * magnitude;

            triangles.push(area);
          }

          return triangles;
        };

        // Run the benchmark with random vectors
        const startTime = performance.now();
        for (let i = 0; i < benchmarkRuns; i++) {
          calculateTriangleArea();
        }
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return executionTime;
      },
    },
    Benchmark3: {
      label: 'Benchmark 3 (User-defined Function)',
      script: () => {
        if (!userFunction) {
          setError('User-defined function is empty');
          return 0;
        }

        try {
          // User-defined function
          const userDefinedFunction = new Function('x', userFunction);

          // Run the user-defined function
          const startTime = performance.now();
          for (let i = 0; i < benchmarkRuns; i++) {
            userDefinedFunction(i);
          }
          const endTime = performance.now();
          const executionTime = endTime - startTime;

          setError(null);
          return executionTime;
        } catch (error) {
          setError(`Error in user-defined function: ${error.message}`);
          return 0;
        }
      },
    },
    // Add more benchmarks as needed
  };

  useEffect(() => {
    const runBenchmark = () => {
      const executionTime = benchmarks[selectedBenchmark].script();
      setBenchmarkResult(`Benchmark completed in ${executionTime.toFixed(2)} milliseconds`);
      setChartData([{ label: selectedBenchmark, value: executionTime }]);
    };

    runBenchmark();
  }, [selectedBenchmark, userFunction, benchmarkRuns]);

  const handleBenchmarkChange = (event) => {
    setSelectedBenchmark(event.target.value);
  };

  const handleRunsChange = (event) => {
    setBenchmarkRuns(parseInt(event.target.value, 10));
  };

  const handleUserFunctionChange = (event) => {
    setUserFunction(event.target.value);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const fileContent = await readFile(file);
        setUserFunction(fileContent);
        setError(null);
      } catch (error) {
        setError(`Error reading file: ${error.message}`);
      }
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (event) => {
        reject(new Error('Error reading file'));
      };

      reader.readAsText(file);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-bold text-2xl">Benchmarking</h2>
      <div>
        <label className="font-bold">Select Benchmark: </label>
        <select className="select-main" style={{ color: "black" }} value={selectedBenchmark} onChange={handleBenchmarkChange}>
          {Object.keys(benchmarks).map((benchmark, index) => (
            <option key={index} value={benchmark}>
              {benchmarks[benchmark].label}
            </option>
          ))}
        </select>
      </div>
      {selectedBenchmark === 'Benchmark3' && (
        <div>
          <div className="flex gap-2">
            <label>Number of Runs: </label>
            <input className="input-main" type="number" value={benchmarkRuns} onChange={handleRunsChange} />
          </div>
          <div className="flex flex-col">
            <label className="text-lg font-semibold mb-1">
              User Benchmark
            </label>
            <textarea
              className="p-2 border rounded-md focus:outline-none focus:ring"
              style={{ color: 'black' }}
              value={userFunction}
              onChange={handleUserFunctionChange}
              placeholder="Enter a JavaScript function. x => Math.sin(x) + Math.cos(x)"
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>
            { error }
          </p>}
        </div>
      )}
      {benchmarkResult && <p className="text-sm">{ benchmarkResult }</p>}
      <div className="py-4 flex flex-col justify-between">
        <h4 className="text-lg">Load Custom Javascript</h4>
        <input type="file" accept=".js" placeholder="" onChange={handleFileChange} />
      </div>
    </div>
  );
};

const Apps = ({ openedApps, closeApp, performanceArray }) => {
  const [allApps, setApps] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // Get current user
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(crntusr);
  }, []);
  
  const installedApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];

  useEffect(() => {
    const matchingApps = apps.filter(app => openedApps.some(openedApp => openedApp === app.name));
    setApps([...installedApps, ...matchingApps]);
  }, [openedApps]);

  // Memoize the performanceArray to prevent unnecessary re-renders
  const memoizedPerformanceArray = useMemo(() => performanceArray, [performanceArray]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row justify-between border-b">
        <h3 className="font-bold text-xl">Title</h3>
        <p className="font-semibold text-xl">Performence</p>
        <h3 className="font-semibold text-xl">Terminate Process</h3>
      </div>
      <div className="">
      {allApps && allApps.map((app) => (
        <div key={app.name} className="grid grid-cols-3 items-center justify-between border-b p-1">
          <h3 className="font-semibold">{ app.name }</h3>
          <p className="font-semibold text-sm">
            {memoizedPerformanceArray.find(per => app.name === per.appName)?.duration || 'N/A'}
          </p>
          <button className="button-main flex justify-center items-center gap-2" onClick={() => closeApp(app.name)}>
            Terminate
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
      ))}
      </div>
    </div>
  );
};

const Gpu = () => {
  const canvasRef = useRef(null);
  const [gpuSpeeds, setGpuSpeeds] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const interval = setInterval(() => {
      const runs = 150000000;
      const start = performance.now();
      for (let i = runs; i > 0; i--) {}
      const end = performance.now();
      const ms = end - start;
      const cyclesPerRun = 2;
      const speed = (runs / ms / 1000000) * cyclesPerRun;

      // Add new speed to the beginning of the array and remove the last one
      setGpuSpeeds(prevSpeeds => {
        const newSpeeds = [Math.round(speed * 10) / 10, ...prevSpeeds.slice(0, 9)];
        return newSpeeds;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate chart dimensions
    const chartWidth = canvas.width - 40;
    const chartHeight = canvas.height - 40;
    const barWidth = chartWidth / gpuSpeeds.length;
    const maxValue = Math.max(...gpuSpeeds);

    // Draw bars for GPU speeds
    gpuSpeeds.forEach((speed, index) => {
      const barHeight = (speed / maxValue) * chartHeight;
      const x = index * (barWidth + 5) + 20;
      const y = chartHeight - barHeight + 20;

      // Blue color for all bars
      ctx.fillStyle = '#3182CE';

      ctx.fillRect(x, y, barWidth, barHeight);

      // Add speed value slightly above the top of each bar
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(`${speed} GHz`, x + barWidth / 2, y - 5);
    });

    // Add axis labels
    ctx.fillStyle = '#2D3748';
    ctx.font = '10px sans-serif';
    gpuSpeeds.forEach((speed, index) => {
      const x = index * (barWidth + 5) + 20 + barWidth / 2;
      const y = chartHeight + 35;
      ctx.fillText(`GPU${index + 1}`, x, y);
    });
  }, [gpuSpeeds]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-2 py-4 text-text-base">
      <h2 className="font-bold text-lg">GPU Speeds</h2>
      <canvas ref={canvasRef} className="border border-gray-300 w-full h-full rounded-lg shadow-md" />
      <p>Cycles per run.</p>
    </div>
  );
};

const Taskmanager = ({ openApp, closeApp, openedApps, performanceArray }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <Apps openedApps={openedApps} closeApp={closeApp} performanceArray={performanceArray} />;
      case 2:
        return <BenchmarkContent />;
      case 3:
        return <Gpu />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row h-full w-full bg-primary text-text-base">
      {/* Collapsible Sidebar */}
      <div className={`flex flex-col h-full w-1/4 gap-2 p-2 bg-primary-light text-white rounded-t-md transition-all duration-500 ease-in-out ${sidebarOpen ? '' : 'w-16'}`}>
        <button className={`button-main ${activeTab == 1 && "!bg-secondary"}`} onClick={() => setActiveTab(1)}>
          {sidebarOpen ? <h3>Apps</h3> : <FontAwesomeIcon icon={faAppStore} className="w-full h-full" />}
        </button>
        <button className={`button-main ${activeTab == 2 && "!bg-secondary"}`} onClick={() => setActiveTab(2)}>
          {sidebarOpen ? <h3>Benchmark</h3> : <FontAwesomeIcon icon={faGaugeHigh} className="w-full h-full" />}
        </button>
        <button className={`button-main ${activeTab == 3 && "!bg-secondary"}`} onClick={() => setActiveTab(3)}>
          {sidebarOpen ? <h3>GPU</h3> : <FontAwesomeIcon icon={faMicrochip} className="w-full h-full" />}
        </button>
        {/* Collapse/Expand Button */}
        <button
          className="button-main mt-auto flex items-center justify-center"
          onClick={toggleSidebar}
        >
          {/* Circle Arrow Icon (Customize as needed) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 transform transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={sidebarOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </button>
      </div>
      {/* Main Content Area */}
      <div className="flex-1 w-3/4 flex-grow p-4 bg-white rounded-b-md">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Taskmanager;