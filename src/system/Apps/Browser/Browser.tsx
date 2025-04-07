import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faTimes, faSync, faStar, faClose, faPlus, faLock, faExpand, faPlusCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../structures/Button';
import logo from "../../../assets/logo.jpeg";
import virtualFS from '../../../utils/VirtualFS';
import { File } from '../../../utils/types';
import { useTopbar } from '../../Topbar/useTopbar';

interface Tab {
  id: number;
  url: string;
  title: string;
  bookmark: boolean;
}

const Browser: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [history, setHistory] = useState<{ [key: number]: string[] }>({});
  const [proxyLinks, setProxyLinks] = useState<string[]>([]);
  const [proxy, setProxy] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [autoComplete, setAutocomplete] = useState<boolean>(true);

  const { addMenu, removeMenu } = useTopbar();

  const fetchLinks = async (): Promise<void> => {
    const links = await virtualFS.readdir("System/Browser/Links");
    const browser = await virtualFS.readdir("System/Browser");
    const active = browser["Active"] as File;

    setTabs([{ id: 1, url: "/home", title: "Tab 0", bookmark: true }]);
    setProxy(active.content);
    setProxyLinks(Object.keys(links));
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    const browserMenu = {
      title: "Tabs",
      icon: "<svg style='filter: invert(1)' viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' fill='#000000'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <title>browser</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-258.000000, -673.000000)' fill='#000000'> <path d='M258,701 C258,703.209 259.791,705 262,705 L286,705 C288.209,705 290,703.209 290,701 L290,683 L258,683 L258,701 L258,701 Z M271,679 C270.448,679 270,678.553 270,678 C270,677.448 270.448,677 271,677 C271.552,677 272,677.448 272,678 C272,678.553 271.552,679 271,679 L271,679 Z M267,679 C266.448,679 266,678.553 266,678 C266,677.448 266.448,677 267,677 C267.552,677 268,677.448 268,678 C268,678.553 267.552,679 267,679 L267,679 Z M263,679 C262.448,679 262,678.553 262,678 C262,677.448 262.448,677 263,677 C263.552,677 264,677.448 264,678 C264,678.553 263.552,679 263,679 L263,679 Z M286,673 L262,673 C259.791,673 258,674.791 258,677 L258,681 L290,681 L290,677 C290,674.791 288.209,673 286,673 L286,673 Z' id='browser' sketch:type='MSShapeGroup'> </path> </g> </g> </g></svg>",
      dropdown: [
        { label: 'NewTab', onClick: addTab, icon: faPlusCircle },
        { label: "Close", onClick: () => closeTab(activeTab), icon: faXmarkCircle }
      ],
    };

    setTimeout(() => {
      addMenu(browserMenu);
    }, 0);

    return () => removeMenu("Tabs");
  }, []);

  // Function to handle adding a new tab
  const addTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, url: proxy || "/home", title: `Tab ${newTabId}`, bookmark: false }]);
    setActiveTab(newTabId);
  };

  // Function to handle closing a tab
  const closeTab = (tabId: number) => {
    setTabs(tabs.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab(tabs.length > 1 ? tabs[tabs.length - 2].id : 0);
    }
  };

  // Function to handle navigating back
  const goBack = () => {
    if (history[activeTab]?.length > 1) {
      const previousUrl = history[activeTab].pop();
      const currentUrl = history[activeTab][history[activeTab].length - 1];
      setTabs(tabs.map(tab => tab.id === activeTab ? { ...tab, url: currentUrl } : tab));
    }
  };

  // Function to handle navigating forward
  const goForward = () => {
    if (history[activeTab]?.length > 0) {
      const nextUrl = history[activeTab].shift();
      setTabs(tabs.map(tab => tab.id === activeTab ? { ...tab, url: nextUrl } : tab));
    }
  };

  // Function to handle changing the active tab
  const changeTab = (tabId: number) => {
    setActiveTab(tabId);
  };

  const handleTabNavigation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setHistory({ ...history, [activeTab]: [...(history[activeTab] || []), value] });
    setTabs(tabs.map(tab => tab.id === activeTab ? { ...tab, url: value } : tab));
  };

  // Function to reload the active tab
  const reloadTab = () => {
    const frame = document.getElementById(`${activeTab}browser`) as HTMLIFrameElement;
    if (frame) {
      frame.src = frame.src;
    }
  };

  // Function to toggle bookmark for a URL
  const toggleBookmark = (url: string) => {
    const index = bookmarks.findIndex(bookmark => bookmark === url);
    if (index === -1) {
      setBookmarks([...bookmarks, url]);
    } else {
      setBookmarks(bookmarks.filter(bookmark => bookmark !== url));
    }
  };

  // Function to set the current tab to a bookmarked URL
  const setTabFromBookmark = (url: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (tabIndex !== -1) {
      const updatedTabs = [...tabs];
      updatedTabs[tabIndex] = { ...updatedTabs[tabIndex], url: url };
      setTabs(updatedTabs);
    } else {
      const newTabId = tabs.length + 1;
      setTabs([...tabs, { id: newTabId, url: url, title: 'New Tab', bookmark: false }]);
      setActiveTab(newTabId);
    }
  };

  const handleIframeLoad = (tabId: number, event: Event) => {
    const frame = event.target as HTMLIFrameElement;
    const url = tabs.find(tab => tab.id === activeTab)?.url.split("https://")[1] || "";
    const title = proxy.split("https://")[1] === url ? btoa(url) : "";
    setTabs(tabs.map(tab => {
      if (tab.id === tabId) {
        return { ...tab, title: title };
      } else {
        return tab;
      }
    }));
  };

  const fullScreen = () => {
    const player = document.getElementById(`${activeTab}browser`) as HTMLIFrameElement;
    if (player) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) { /* Firefox */
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) { /* IE/Edge */
            player.msRequestFullscreen();
        }
    }
  }

  // Function to render the input field with encoded text for proxy links
  const renderInputField = () => {
    const currentTabUrl = tabs.find(tab => tab.id === activeTab)?.url;
    const iframe = document.getElementById(`${tabs.find(tab => tab.id === activeTab)?.id}browser`) as HTMLIFrameElement;
    let encodedUrl = currentTabUrl;
    const isProxyLink = proxyLinks.some(link => {
      const processedUrl = currentTabUrl ? currentTabUrl.replace(/^https?:\/\//, "").toLowerCase() : "";
      const processedLink = link.replace(/^https?:\/\//, "").toLowerCase();
      return processedUrl === processedLink;
    });

    try {
      // Access the title property of the iframe's document
      var iframeTitle = iframe.contentWindow.document.title;
      const tab = tabs.find(tab => tab.id === activeTab).title;
      if (tab) tab = iframeTitle;
    } catch (error) {
      // console.error("Error accessing iframe content:", error.message);
      // Handle the error (e.g., display a message to the user)
      const tab = tabs.find(tab => tab.id === activeTab);
      if (tab) {
        tab.title = `Tab ${tab.id ? tab.id : tabs.length}`;
      }
    }
  
    // Replace specific URLs with "example.com"
    if (autoComplete) {
      switch (currentTabUrl) {
        case "google.com" && iframe?.src !== "google.com":
          encodedUrl = "https://google.com/webhp?igu=1";
          iframe.src = encodedUrl;
          break;
        case "https://google.com" && iframe?.src !== "https://google.com":
          encodedUrl = "https://google.com/webhp?igu=1";
          iframe.src = encodedUrl;
          break;
        // Add more cases as needed
        default:
          break;
      }
    }

    // Encode URL if it's a proxy link
    if (isProxyLink) {
      encodedUrl = btoa(encodedUrl);
    }

    return (
      <div className={`relative !flex-grow`}>
        <div className="group">
          <FontAwesomeIcon icon={faLock} className="absolute top-0 left-1 text-gray-500 hover:bg-primary rounded p-2 cursor-pointer" />
          <div className="absolute top-10 flex flex-col gap-2 bg-secondary-light scale-0 transition-transform duration-200 origin-top group-active:scale-100 hover:scale-100 p-1 rounded">
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => {window.open("https://github.com/LuminesenceProject/LumiOS")}}>Info</button>
                <button htmlFor="file-input" className="transition-colors duration-200 hover:bg-secondary p-2 rounded cursor-pointer">Proxy: {isProxyLink ? "true" : "false"}</button>
                <button className="transition-colors duration-200 hover:bg-secondary p-2 rounded" onClick={() => setAutocomplete(!autoComplete)}>AutoComplete: { autoComplete.toString() }</button>
            </div>
        </div>
        <input 
          type="text" 
          className="w-full bg-primary-light text-text-base font-bold py-1 px-4 rounded pl-10" 
          value={encodedUrl || ''} 
          onChange={handleTabNavigation} 
        />
      </div>
    );
  };

  // Function to render special content for custom paths
  const renderSpecialContent = (url: string) => {

    switch (url) {
      case "/home": {
        
        return (
          <div className="flex flex-col justify-center items-center text-text-base">
            <img className="w-10 h-10" src={logo} alt="logo" />
            <h3 className="font-bold text-2xl">Lumi OS</h3>
            <p className="">A product of the Luminesence Project. Some links are built into the Browser App!</p>
            <ol>
              <li>/home</li>
              <li>/proxy</li>
              <li>/settings</li>
            </ol>
          </div>
        )
      }

      case "/proxy": {      
        const addProxy = async (link: string) => {
          await virtualFS.writeFile("System/Browser/Links", link, link, "txt");
          setProxyLinks(prev => [...prev, link]);
        }
      
        const removeProxy = async (index: number) => {
          const linkName = proxyLinks[index];

          await virtualFS.deleteFile("System/Browser/Links", linkName);
          await virtualFS.deleteFile("System/Browser", "Active");
          await virtualFS.writeFile("System/Browser", "Active", "/home", "sys");
          setProxyLinks((prev) => prev.filter(value => value !== linkName));
        }
      
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          // @ts-ignore
          const input = e.target.children[0].value;
          addProxy(input);
        };

        const handleProxy = async (link: string): Promise<void> => {
          setProxy(link);

          await virtualFS.deleteFile("System/Browser", "Active");
          await virtualFS.writeFile("System/Browser", "Active", link, "sys");
        }
      
        return (
          <div className="flex flex-col text-text-base overflow-auto">
            <h2 className="font-bold text-2xl py-2">Enter a Proxy</h2>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input name="proxyLink" className="input-main" placeholder="Enter Proxy Link" />
              <Button type="submit" className="bg-primary-light hover:bg-primary text-text-base font-bold py-2 px-4 rounded">
                Add Proxy
              </Button>
            </form>
            <div className="grid py-2 gap-2" style={{gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))"}}>
              {proxyLinks.map((link, index) => (
                <div 
                key={index} 
                onClick={() => handleProxy(link)}
                className={`flex flex-row gap-2 justify-between items-center bg-secondary-light hover:bg-secondary transition-colors duration-200 text-text-base font-bold py-2 px-5 rounded cursor-pointer ${proxy === link && "!bg-secondary"}`}>
                  {link}
                  <FontAwesomeIcon 
                  icon={faClose} 
                  onClick={() => removeProxy(index)}
                  className="hover:bg-secondary-light p-1 cursor-pointer rounded" />
                </div>
              ))}
            </div>
          </div>
        );
      }       

      case "/settings": {

        return (
          <div className="flex flex-col text-center text-text-base">
            <h2>Currently there is nothing here.</h2>
            <p>Come back later for new content!</p>
          </div>
        )
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="bg-primary p-1 flex gap-2">
        <img src={logo} alt="LumiOS" className="w-10 aspect-square" />
        {tabs.map(tab => (
          <Button key={tab.id} className={`${activeTab === tab.id ? '!bg-secondary' : ''}`}
                  onClick={() => changeTab(tab.id)}>
            {tab.title}
            <span className="ml-2" onClick={() => closeTab(tab.id)}>
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </Button>
        ))}
        {/* Button to add new tab */}
        <Button onClick={addTab}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <div className="flex-grow" onDoubleClick={addTab}></div>
      </div>
      {/* Browser toolbar */}
      <div className="bg-primary flex gap-2 justify-between items-center p-1">
        {/* Back button */}
        <button className="browser-icon-main"
                onClick={goBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        {/* Forward button */}
        <button className="browser-icon-main"
                onClick={goForward}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        {/* Reload button */}
        <button className="browser-icon-main"
                onClick={reloadTab}>
          <FontAwesomeIcon icon={faSync} />
        </button>
        <button className="browser-icon-main"
                onClick={fullScreen}>
          <FontAwesomeIcon icon={faExpand} />
        </button>
        <select className="select-main text-text-base bg-secondary !w-32 !py-1 font-bold" onChange={(e) => setProxy(e.target.value)}>
          <option className="option-main" value="https://google.com/webhp?igu=1">None</option>
          {proxyLinks && proxyLinks.map((link, index) => (
            <option className="option-main" key={index} value={link}>Proxy { index }</option>
          ))}
        </select>
        {/* Input for URL */}
        {renderInputField()}
        {/* Star button */}
        <button className="browser-icon-main"
          onClick={() => {
            const tab = tabs.find(tab => tab.id === activeTab)
            if (!proxyLinks.includes(tab.url)) {
              toggleBookmark(tabs.find(tab => tab.id === activeTab)?.url);
            }          
        }}>
          {!bookmarks.includes(tabs.find(tab => tab.id === activeTab)?.url) ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-5 w-5">
              <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/>
            </svg>
          ) : (
            <FontAwesomeIcon icon={faStar} />
          )}
        </button>
      </div>
      {/* Bookmark bar */}
      <div className="bg-primary flex gap-2 p-1 mb-2">
        {bookmarks.map((bookmark, index) => (
          <Button 
            key={index} 
            className="browser-icon-main !py-1 !px-2 text-sm"
            onClick={() => setTabFromBookmark(bookmark)}
          >
            {bookmark}
          </Button>
        ))}
      </div>
      {/* Display area for the active tab */}
      <div className="flex-1 p-2 h-full w-full">
        {/* Render the content of the active tab here */}
        {tabs.map(tab => (
          <div key={tab.id} className={`${activeTab === tab.id ? '' : 'hidden'} h-full`}>
            {tab.url.startsWith('/') ? (
              renderSpecialContent(tab.url)
            ) : (
              <embed
                key={tab.id} 
                src={tab.url} 
                id={`${tab.id}browser`} 
                className="w-full h-full border-0" 
                onLoad={(event) => handleIframeLoad(tab.id, event)}
                onContextMenu={() => {}}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Browser;