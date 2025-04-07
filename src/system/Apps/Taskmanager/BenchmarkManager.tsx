import { useEffect, useState } from "react";
import { saveStamp } from "../../../structures/Timestamp";

const BenchMarkManager = () => {
    const [benchmarkResult, setBenchmarkResult] = useState<string | null>(null);
    const [selectedBenchmark, setSelectedBenchmark] = useState<string>('Benchmark1');
    const [chartData, setChartData] = useState<{ label: string; value: number }[]>([]);
    const [benchmarkRuns, setBenchmarkRuns] = useState<number>(1);
    const [userFunction, setUserFunction] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
  
    const benchmarks = {
      Benchmark1: {
        label: 'Benchmark 1 (Prime Numbers)',
        script: () => {
          // Sieve of Eratosthenes algorithm to find prime numbers up to a certain limit
          const sieveOfEratosthenes = (limit: number) => {
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
          const calculateTriangleArea = () => {
            const triangles = [];
            const randomVector = () => ({
              x: Math.random(),
              y: Math.random(),
              z: Math.random(),
            });
  
            for (let i = 0; i < 10000; i++) {
              const vectorA = randomVector();
              const vectorB = randomVector();
              // const vectorC = randomVector(); // Remove this for now ig
  
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
            setError("User-defined function is empty");
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
            setError(`Error in user-defined function: ${(error as Error).message}`);
            return 0;
          }
        },
      },
      // Add more benchmarks as needed
    };
  
    useEffect(() => {
        const runBenchmark = () => {
          const executionTime = benchmarks[selectedBenchmark as keyof typeof benchmarks].script();
          setBenchmarkResult(`Benchmark completed in ${executionTime.toFixed(2)} milliseconds`);
          setChartData([{ label: selectedBenchmark, value: executionTime }]);

          saveStamp({
            app: "BenchmarkManager",
            content: {
              selectedBenchmark: selectedBenchmark,
              executionTime: executionTime,
              userFunction: userFunction,
              error: error,
            },
            openedApps: [],
          });
        };
      
        runBenchmark();
      }, [selectedBenchmark, userFunction, benchmarkRuns]);      
  
    const handleBenchmarkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedBenchmark(event.target.value);
    };
  
    const handleRunsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setBenchmarkRuns(parseInt(event.target.value, 10));
    };
  
    const handleUserFunctionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setUserFunction(event.target.value);
    };
  
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files![0];
  
      if (file) {
        try {
          const fileContent = await readFile(file);
          setUserFunction(fileContent);
          setError(null);
        } catch (error) {
          setError(`Error reading file: ${(error as Error).message}`);
        }
      }
    };
  
    const readFile = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            resolve(event.target.result);
          } else {
            reject(new Error('Error reading file'));
          }
        };
  
        reader.onerror = () => {
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
            {Object.keys(benchmarks).map((benchmarkKey, index) => (
                <option key={index} value={benchmarkKey}>
                    {benchmarks[benchmarkKey as keyof typeof benchmarks].label}
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
          <input type="file" accept=".js" placeholder="" style={{ all: "unset"}} onChange={handleFileChange} />
        </div>
      </div>
    );
}
 
export default BenchMarkManager;