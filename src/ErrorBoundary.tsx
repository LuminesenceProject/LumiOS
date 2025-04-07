import { Component, ReactNode, ErrorInfo } from 'react';
import { Stamp } from './utils/types';
import { saveStamp } from './structures/Timestamp';

const cipher = (salt: string) => {
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const byteHex = (n: number) => ("000" + Number(n).toString(16)).substr(-4);
  const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text: string) => text.split('')
    .map(textToChars)
    // @ts-ignore
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}
const decipher = (salt: string) => {
  const textToChars = (text: string) => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = (code: number) => textToChars(salt).reduce((a, b) => a ^ b, code);
  return (encoded: string) => encoded.match(/.{1,4}/g)
    ?.map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

interface ErrorBoundaryProps {
  showBootScreen: (value: boolean) => void;
  children: ReactNode; // Define children here
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state to indicate an error occurred
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by error boundary:', error, errorInfo);

    const stamp: Stamp = {
      app: "ErrorBoundary",
      content: errorInfo,
      openedApps: [],
      error: error,
    }

    saveStamp(stamp);
  }
  
  static randomizedSubstitutionEncrypt(data: any) {
    const salt = "50mI0s"; // You can set your custom salt here
    const encrypt = cipher(salt);
  
    return encrypt(data);
  }
  
  static decryptEncryptedFile(encryptedData: any) {
    const salt = '50mI0s'; // Use the same salt used for encryption
    const decrypt = decipher(salt);
  
    return decrypt(encryptedData);
  }

  static exportEncryptedFile() {
    const stamps = localStorage.getItem("stamps");
  
    const encrypted = ErrorBoundary.randomizedSubstitutionEncrypt(stamps as string);
  
    // Convert encrypted data to Blob
    const blob = new Blob([encrypted], { type: 'application/octet-stream' });
  
    // Create a temporary anchor element
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'encrypted_file.dat'; // Set the filename to .dat
    downloadLink.style.display = 'none';
  
    downloadLink.click();
  }  
  
  render() {
    if (this.state.hasError) {
      // You can render a fallback UI here
      return (
        <div style={{ background: '#4285f4' }} className="flex flex-col justify-center items-center max-h-screen py-20">
          <div id="page" className="text-lg">
            <div className="flex flex-col gap-2 my-5">
              <h1 className="text-6xl mb-10">:(</h1>
              <h2>
                Your PC ran into a problem and needs to restart. We're just collecting
                some error info, and then we'll restart for you.
              </h2>
              <h2>
                <span id="percentage">0</span>% complete
              </h2>
              <div id="details" className="flex flex-col md:flex-row items-center md:items-start pt-10">
                <div id="qr" className="mb-5 md:mb-0 md:mr-10">
                  <div id="image" className="bg-white p-5 leading-0">
                    <img
                      src="https://win11.blueedge.me/img/qr.png"
                      alt="QR Code"
                      className="w-9.8em h-9.8em"
                    />
                  </div>
                </div>
                <div id="stopcode">
                  <h4 className="text-xl leading-1.5em mb-5">
                    For more information about this issue and possible fixes, visit
                    <br />{" "}
                    <a href="https://github.com/LuminesenceProject/LumiOS/issues">
                      https://github.com/LuminesenceProject/LumiOS/issues
                    </a>{" "}
                  </h4>
                  <h5 className="leading-22px text-base font-normal">
                    If you call a support person, give them this info:
                    <br />
                    Error: {this.state.error && this.state.error.message}
                    <br />
                    Also, download this file:   
                    <br />
                    <button onClick={ErrorBoundary.exportEncryptedFile} className="p-2 text-text-base bg-primary hover:bg-secondary-light transition-all duration-200 active:scale-95 rounded">
                      Download
                    </button>
                  </h5>
                  <div className="flex flex-row gap-5 p-10">
                    <button onClick={() => window.location.reload()} className="p-2 text-text-base bg-primary hover:bg-secondary-light transition-all duration-200 active:scale-95 rounded">
                      Try again
                    </button>
                    <button className="p-2 text-text-base bg-primary hover:bg-secondary-light transition-all duration-200 active:scale-95 rounded" onClick={() => {
                      indexedDB.deleteDatabase("VirtualFileSystemDB");
                      window.location.reload();
                    }}>
                      Reset Lumi OS
                    </button>
                  </div>
                  <button onClick={() => this.props.showBootScreen(true)}>
                      Bootscreen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;