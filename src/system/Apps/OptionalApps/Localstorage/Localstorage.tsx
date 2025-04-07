import { useEffect, useState } from 'react';
import Button from '../../../../structures/Button';
import { saveStamp } from '../../../../structures/Timestamp';

const LocalStorageViewer: React.FC = () => {
  const [localStorageKeys, setLocalStorageKeys] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');
  // Will remove any unwanted user interaction
  const excluded: string[] = ["stamps"];

  // Load localStorage keys on component mount
  useEffect(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !excluded.includes(key)) {
        keys.push(key);
      }
    }
    setLocalStorageKeys(keys);
  }, []);

  // Handle click on a key
  const handleKeyClick = (key: string) => {
    setSelectedKey(key);
    setNewValue(localStorage.getItem(key) || '');
  };

  // Handle change in textarea
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewValue(event.target.value);
  };

  // Handle save button click
  const handleSaveClick = () => {
    if (selectedKey) {
      // Save stamp before the value is set
      saveStamp({
        app: "LocalstorageViewer",
        content: {
          name: selectedKey,
          previusValue: localStorage.getItem(selectedKey),
          newValue: newValue,
        },
        openedApps: [],
      });

      localStorage.setItem(selectedKey, newValue);
      setNewValue('');
      setSelectedKey(null);
      // Reload keys
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !excluded.includes(key)) {
          keys.push(key);
        }
      }
      setLocalStorageKeys(keys);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setNewValue('');
    setSelectedKey(null);
  };

  return (
    <div className="flex flex-col h-full">
      {selectedKey ? (
        <div className="flex flex-col h-full">
          <textarea value={newValue} onChange={handleTextareaChange} className="border rounded-md p-2 h-full mt-1" />
          <div className="flex justify-between mt-2">
            <Button onClick={handleSaveClick}>
              Save
            </Button>
            <Button onClick={handleCancelClick}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 justify-center items-center p-2">
          {localStorageKeys.map((key) => (
            <div key={key} className="flex flex-col w-full overflow-hidden items-center justify-between bg-primary-light hover:bg-secondary transition-colors duration-200 rounded p-2 cursor-pointer" onClick={() => handleKeyClick(key)}>
              <h2 className="font-bold text-md">{key}</h2>
            </div>
          ))}
          {localStorageKeys.length == 0 && 
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-bold text-xl">Localstorage</h3>
            <p>There are no items.</p>
          </div>
          }
        </div>
      )}
    </div>
  );
};

export default LocalStorageViewer;