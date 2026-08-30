import React, { useState, useRef, useEffect } from 'react';
import API from '../utils/api';
import {
  seatMapWrapper,
  seatMapHeader,
  seatMapBody,
  seatMapCanvasArea,
  canvasGridBg,
  propertiesSidebar,
  seatMapFooter,
  sidebarToggleBtn,
  pageTabsBar,
  pageTabActive,
  pageTabInactive,
  addPageButton,
  modalOverlay,
  modalBox,
  inputFieldStyle,
  primaryButton
} from '../styles/MasterCSSClass';

const SeatMap = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [clipboard, setClipboard] = useState(null); // Tracks copied/cut item
  const [viewMode, setViewMode] = useState('creator');
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Tools: 'selectRow', 'selectSeat', 'addRow', 'addRowsBlock', 'addSquare', 'addRectangle', 'addCircle', 'addText'
  const [activeTool, setActiveTool] = useState('addRowsBlock');

  // Application History Stack
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Multi-Page Support State with 3:4 Default Design Page Ratio Dimensions (e.g. 900px width by 1200px height)
  const [pages, setPages] = useState([
    { id: 'page-1', name: 'Plan 1', width: 900, height: 1200 }
  ]);
  const [activePageId, setActivePageId] = useState('page-1');
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingPageName, setEditingPageName] = useState('');

  // Zones Manager States
  const [zones, setZones] = useState([
    { id: 'zone-1', name: 'Ground floor' },
  
  ]);
  const [activeZoneId, setActiveZoneId] = useState('zone-1');
  const [showNewZoneModal, setShowNewZoneModal] = useState(false);
  const [newZoneNameInput, setNewZoneNameInput] = useState('');

  // Custom Categories & Colors Store
  const [customCategories, setCustomCategories] = useState([
    { name: 'Category I', color: '#f93822' },
    { name: 'Category II', color: '#c0392b' },
    { name: 'Category III', color: '#27ae60' },
    { name: 'Category IV', color: '#2980b9' },
    { name: 'Category V', color: '#16a085' }
  ]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCatNameInput, setNewCatNameInput] = useState('');
  const [newCatColorInput, setNewCatColorInput] = useState('#8b5cf6');

  // Seating Blocks & Shapes Collections
  const [sections, setSections] = useState([]);
  const [shapes, setShapes] = useState([]);
  
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null); 
  const [selectedSeatKey, setSelectedSeatKey] = useState(null); 
  const [isShapeRotating, setIsShapeRotating] = useState(false);
const [shapeRotateCenter, setShapeRotateCenter] = useState({ x: 0, y: 0 });

  // Simultaneous Drag & Move / Resize States
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [drawCurrent, setDrawCurrent] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);

  // Manual rotation handle state
  const [isRotating, setIsRotating] = useState(false);
  const [rotateCenter, setRotateCenter] = useState({ x: 0, y: 0 });

  // Shape & Block Resizing State
  const [resizingShapeId, setResizingShapeId] = useState(null);
  const [resizingBlockId, setResizingBlockId] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);

  const canvasRef = useRef(null);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const isEmpty = sections.length === 0 && shapes.length === 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const isCtrl = e.ctrlKey || e.metaKey;

      if (e.key === 'Delete' || e.key === 'Del') {
        handleDeleteSelected();
      } else if (isCtrl && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if (isCtrl && e.key.toLowerCase() === 'y') {
        handleRedo();
      } else if (isCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopy();
      } else if (isCtrl && e.key.toLowerCase() === 'x') {
        e.preventDefault();
        handleCut();
      } else if (isCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePaste();
      } else if (isCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicate();
      } else if (isCtrl && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoomLevel(prev => Math.min(300, prev + 10));
      } else if (isCtrl && e.key === '-') {
        e.preventDefault();
        setZoomLevel(prev => Math.max(10, prev - 10));
      } else {
       const key = e.key.toLowerCase();
        if (key === 'v' && !isCtrl) setActiveTool('selectRow');
        if (key === 's' && !isCtrl) setActiveTool('selectSeat');
        if (key === 'n' && !isCtrl) {
          if (e.shiftKey) setActiveTool('addRowsBlock');
          else setActiveTool('addRow');
        }
        if (key === 'm' && !isCtrl) setActiveTool('addSquare');
        if (key === 'r' && !isCtrl) setActiveTool('addRectangle');
        if (key === 'o' && !isCtrl) setActiveTool('addCircle'); // Only 'o' triggers circle now
        if (key === 'p' && !isCtrl) setActiveTool('addRowsBlock');
       if (key === 't' && !isCtrl) {
        handleAddShape('text', '', 140, 40);
        setActiveTool('addText'); // <-- This activates the border highlight on the text tool icon
      }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSectionId, selectedShapeId, sections, shapes, history, redoStack]);

  function toRoman(num) {
    let n = Number(num);
    if (isNaN(n) || n < 1) return String(num);
    const lookup = {m:1000,cm:900,d:500,cd:400,c:100,xc:90,l:50,xl:40,x:10,ix:9,v:5,iv:4,i:1};
    let roman = '';
    for (let i in lookup) {
      while (n >= lookup[i]) {
        roman += i;
        n -= lookup[i];
      }
    }
    return roman || 'i';
  }

  function getLabel(index, numberingType, startingAt, reversed, totalCount) {
    let startVal = startingAt === '' || startingAt === undefined || isNaN(Number(startingAt)) ? 1 : Number(startingAt);
    let actualIndex = startVal + index;
    if (reversed) {
      actualIndex = startVal + (totalCount - 1 - index);
    }

    if (numberingType === 'roman') {
      return toRoman(actualIndex);
    } else if (numberingType === 'capital') {
      let label = '';
      let num = actualIndex;
      if (num < 1) return String(num);
      while (num > 0) {
        let remainder = (num - 1) % 26;
        label = String.fromCharCode(65 + remainder) + label;
        num = Math.floor((num - 1) / 26);
      }
      return label || 'A';
    } else if (numberingType === 'small') {
      let label = '';
      let num = actualIndex;
      if (num < 1) return String(num);
      while (num > 0) {
        let remainder = (num - 1) % 26;
        label = String.fromCharCode(97 + remainder) + label;
        num = Math.floor((num - 1) / 26);
      }
      return label || 'a';
    }

    return String(actualIndex);
  }

  function generateSeats(rowCount, seatCount, rowNumType, rowStart, rowRev, seatNumType, seatStart, seatRev, defaultCategory = '') {
    const seatMap = {};
    for (let r = 0; r < rowCount; r++) {
      const rowLabel = getLabel(r, rowNumType, rowStart, rowRev, rowCount);
      for (let s = 0; s < seatCount; s++) {
        const seatLabel = getLabel(s, seatNumType, seatStart, seatRev, seatCount);
        const seatKey = `${rowLabel}-${seatLabel}`;
        seatMap[seatKey] = { status: 'available', category: defaultCategory, offsetX: 0, offsetY: 0 };
      }
    }
    return seatMap;
  }

  const pageSections = sections.filter(s => (s.pageId || 'page-1') === activePageId);
  const pageShapes = shapes.filter(sh => (sh.pageId || 'page-1') === activePageId);

  const activeSection = sections.find(s => s.id === selectedSectionId) || null;
  const activeShape = shapes.find(sh => sh.id === selectedShapeId) || null;

  const pushHistory = (newSections, newShapes = shapes) => {
    setHistory(prev => [...prev, { sections, shapes }]);
    setRedoStack([]);
    setSections(newSections);
    setShapes(newShapes);
  };

const handleCopy = () => {
    if (activeSection) {
      setClipboard({ type: 'section', data: activeSection, isCut: false });
    } else if (activeShape) {
      setClipboard({ type: 'shape', data: activeShape, isCut: false });
    }
  };

  const handleCut = () => {
    if (activeSection) {
      setClipboard({ type: 'section', data: activeSection, isCut: true });
      const filtered = sections.filter(s => s.id !== activeSection.id);
      pushHistory(filtered, shapes);
      setSelectedSectionId(null);
    } else if (activeShape) {
      setClipboard({ type: 'shape', data: activeShape, isCut: true });
      const filtered = shapes.filter(sh => sh.id !== activeShape.id);
      pushHistory(sections, filtered);
      setSelectedShapeId(null);
    }
  };

const handlePaste = () => {
    if (!clipboard) return;
    const newId = Date.now();
    const count = sections.length + shapes.length; // Used to cascade offsets cleanly so they never stack identically
    
    if (clipboard.type === 'section') {
      const pastedSec = {
        ...clipboard.data,
        id: newId,
        pageId: activePageId, // Ensures it pastes onto the currently active page
        x: clipboard.data.x + 25 + ((count % 5) * 10), // Cascades step-by-step
        y: clipboard.data.y + 25 + ((count % 5) * 10)
      };
      pushHistory([...sections, pastedSec], shapes);
      setSelectedSectionId(newId);
    } else if (clipboard.type === 'shape') {
      const pastedSh = {
        ...clipboard.data,
        id: newId,
        pageId: activePageId, // Ensures it pastes onto the currently active page
        x: clipboard.data.x + 25 + ((count % 5) * 10), // Cascades step-by-step
        y: clipboard.data.y + 25 + ((count % 5) * 10)
      };
      pushHistory(sections, [...shapes, pastedSh]);
      setSelectedShapeId(newId);
    }

    if (clipboard.isCut) {
      setClipboard(null);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack([{ sections, shapes }, ...redoStack]);
    setSections(previous.sections);
    setShapes(previous.shapes);
    setHistory(history.slice(0, history.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory(prev => [...prev, { sections, shapes }]);
    setSections(next.sections);
    setShapes(next.shapes);
    setRedoStack(redoStack.slice(1));
  };

const handleDuplicate = () => {
    if (activeSection) {
      const newId = Date.now();
      const duplicatedSec = {
        ...activeSection,
        id: newId,
        pageId: activePageId,
        x: activeSection.x + 25,
        y: activeSection.y + 25
      };
      pushHistory([...sections, duplicatedSec], shapes);
      setSelectedSectionId(newId);
    } else if (activeShape) {
      const newId = Date.now();
      const duplicatedSh = {
        ...activeShape,
        id: newId,
        pageId: activePageId,
        x: activeShape.x + 25,
        y: activeShape.y + 25
      };
      pushHistory(sections, [...shapes, duplicatedSh]);
      setSelectedShapeId(newId);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedSeatKey && activeSection) {
      const updatedSeats = { ...activeSection.seats };
      delete updatedSeats[selectedSeatKey];
      const newSecs = sections.map(sec => sec.id === activeSection.id ? { ...sec, seats: updatedSeats } : sec);
      pushHistory(newSecs, shapes);
      setSelectedSeatKey(null);
    } else if (activeSection) {
      const filtered = sections.filter(s => s.id !== activeSection.id);
      pushHistory(filtered, shapes);
      setSelectedSectionId(filtered.length > 0 ? filtered[0].id : null);
    } else if (activeShape) {
      const filtered = shapes.filter(sh => sh.id !== activeShape.id);
      pushHistory(sections, filtered);
      setSelectedShapeId(null);
    }
  };

  const handleDeletePage = (pageIdToRemove, e) => {
    e.stopPropagation();
    if (pages.length <= 1) {
      alert("You must keep at least one page.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this page and its seating layout?")) {
      const updatedPages = pages.filter(p => p.id !== pageIdToRemove);
      setPages(updatedPages);
      
      setSections(sections.filter(s => (s.pageId || 'page-1') !== pageIdToRemove));
      setShapes(shapes.filter(sh => (sh.pageId || 'page-1') !== pageIdToRemove));

      if (activePageId === pageIdToRemove) {
        setActivePageId(updatedPages[0].id);
      }
    }
  };

  const handleFullDeleteZone = (zoneIdToDelete) => {
    if (zones.length <= 1) {
      alert("You must keep at least one zone.");
      return;
    }

    const zoneToDelete = zones.find(z => z.id === zoneIdToDelete);
    if (window.confirm(`Are you sure you want to completely delete "${zoneToDelete?.name}" and all its seating blocks?`)) {
      const updatedZones = zones.filter(z => z.id !== zoneIdToDelete);
      setZones(updatedZones);
      setSections(sections.filter(s => s.zoneId !== zoneIdToDelete));
      setActiveZoneId(updatedZones[0].id);
      setSelectedSectionId(null);
    }
  };

  const [draggingId, setDraggingId] = useState(null);
  const [draggingSeatKey, setDraggingSeatKey] = useState(null);
  const [draggingRowLetter, setDraggingRowLetter] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, secId) => {
    if (viewMode === 'preview') return;
    e.stopPropagation();
    if (activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }
    setDraggingId(secId);
    const sec = sections.find(s => s.id === secId);
    setDragOffset({ x: e.clientX - sec.x, y: e.clientY - sec.y });
    setSelectedSectionId(secId);
    setSelectedShapeId(null);
  };

  const handleShapeMouseDown = (e, shId) => {
    if (viewMode === 'preview') return;
    e.stopPropagation();
    setDraggingId(shId);
    const sh = shapes.find(s => s.id === shId);
    setDragOffset({ x: e.clientX - sh.x, y: e.clientY - sh.y });
    setSelectedShapeId(shId);
    setSelectedSectionId(null);
  };

  const handleSeatMouseDown = (e, secId, seatKey) => {
    if (activeTool === 'selectSeat') {
      e.stopPropagation();
      setDraggingSeatKey(seatKey);
      setSelectedSectionId(secId);
      setSelectedSeatKey(seatKey);
      setSelectedRowKey(null);
    }
  };

  const handleRowMarkerMouseDown = (e, secId, rowLetter) => {
    e.stopPropagation();
    setDraggingRowLetter(rowLetter);
    setSelectedSectionId(secId);
    setSelectedRowKey(rowLetter);
    setSelectedSeatKey(null);
  };

  const handleRotateStart = (e, sec) => {
    e.stopPropagation();
    setIsRotating(true);
    setSelectedSectionId(sec.id);
    const centerX = sec.x + 50;
    const centerY = sec.y + 50;
    setRotateCenter({ x: centerX, y: centerY });
  };

  const handleCanvasMouseDown = (e) => {
    if (viewMode === 'preview') return;

    if (activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (['selectRow', 'selectSeat'].includes(activeTool)) {
      const rect = e.currentTarget.getBoundingClientRect();
      const startX = (e.clientX - rect.left - panOffset.x) / (zoomLevel / 100);
      const startY = (e.clientY - rect.top - panOffset.y) / (zoomLevel / 100);
      setSelectionBox({ startX, startY, currentX: startX, currentY: startY });
      return;
    }

    const boardEl = canvasRef.current.querySelector('.canvasBoard') || e.currentTarget;
    const rect = boardEl.getBoundingClientRect();
    
    let origin_x = (e.clientX - rect.left) / (zoomLevel / 100);
    let origin_y = (e.clientY - rect.top) / (zoomLevel / 100);

    if (e.shiftKey) {
      origin_x = Math.round(origin_x / 25) * 25;
      origin_y = Math.round(origin_y / 25) * 25;
    }

    setDrawStart({ x: origin_x, y: origin_y });
    setDrawCurrent({ x: origin_x, y: origin_y });
    setIsDrawing(true);
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (resizingBlockId) {
      const boardEl = canvasRef.current.querySelector('.canvasBoard') || canvasRef.current;
      const rect = boardEl.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / (zoomLevel / 100);
      const currentY = (e.clientY - rect.top) / (zoomLevel / 100);

      setSections(sections.map(sec => {
        if (sec.id === resizingBlockId) {
          const deltaX = Math.max(50, currentX - sec.x);
          const deltaY = Math.max(50, currentY - sec.y);
          const newCols = Math.max(1, Math.floor(deltaX / (sec.boxSize + (sec.seatSpacing || 2) + 2)));
          const newRows = Math.max(1, Math.floor(deltaY / (sec.boxSize + (sec.rowSpacing || 2) + 2)));
          const updatedSeats = generateSeats(
            newRows,
            newCols,
            sec.rowNumberingType,
            sec.rowStartingAt,
            sec.rowReversed,
            sec.seatNumberingType,
            sec.seatStartingAt,
            sec.seatReversed,
            sec.category
          );
          return { ...sec, rows: newRows, seatsPerRow: newCols, seats: updatedSeats };
        }
        return sec;
      }));
      return;
    }

    if (isShapeRotating && selectedShapeId) {
      const boardEl = canvasRef.current.querySelector('.canvasBoard') || canvasRef.current;
      const rect = boardEl.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / (zoomLevel / 100);
      const mouseY = (e.clientY - rect.top) / (zoomLevel / 100);

      const radians = Math.atan2(mouseY - shapeRotateCenter.y, mouseX - shapeRotateCenter.x);
      let degrees = (radians * (180 / Math.PI)) + 90;

      setShapes(shapes.map(sh => 
        sh.id === selectedShapeId ? { ...sh, rotation: Math.round(degrees) } : sh
      ));
      return;
    }

 if (resizingShapeId && resizeHandle) {
      const boardEl = canvasRef.current.querySelector('.canvasBoard') || canvasRef.current;
      const rect = boardEl.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / (zoomLevel / 100);
      const currentY = (e.clientY - rect.top) / (zoomLevel / 100);

      setShapes(shapes.map(sh => {
        if (sh.id === resizingShapeId) {
          let newW = sh.width;
          let newH = sh.height;
          let newX = sh.x;
          let newY = sh.y;

          if (resizeHandle === 'se') {
            newW = Math.max(20, currentX - sh.x);
            newH = Math.max(20, currentY - sh.y);
          } else if (resizeHandle === 'nw') {
            newW = Math.max(20, sh.width + (sh.x - currentX));
            newH = Math.max(20, sh.height + (sh.y - currentY));
            newX = currentX;
            newY = currentY;
          } else if (resizeHandle === 'ne') {
            newW = Math.max(20, currentX - sh.x);
            newH = Math.max(20, sh.height + (sh.y - currentY));
            newY = currentY;
          } else if (resizeHandle === 'sw') {
            newW = Math.max(20, sh.width + (sh.x - currentX));
            newH = Math.max(20, currentY - sh.y);
            newX = currentX;
          }
          return { ...sh, x: newX, y: newY, width: newW, height: newH };
        }
        return sh;
      }));
      return;
    }

    if (draggingSeatKey && selectedSectionId) {
      const movementX = e.movementX / (zoomLevel / 100);
      const movementY = e.movementY / (zoomLevel / 100);
      setSections(sections.map(sec => {
        if (sec.id === selectedSectionId) {
          const seatObj = sec.seats[draggingSeatKey];
          if (!seatObj) return sec;
          const updatedSeat = {
            ...seatObj,
            offsetX: (seatObj.offsetX || 0) + movementX,
            offsetY: (seatObj.offsetY || 0) + movementY
          };
          return { ...sec, seats: { ...sec.seats, [draggingSeatKey]: updatedSeat } };
        }
        return sec;
      }));
      return;
    }

    if (draggingRowLetter && selectedSectionId) {
      const movementY = e.movementY / (zoomLevel / 100);
      setSections(sections.map(sec => {
        if (sec.id === selectedSectionId) {
          const updatedSeats = { ...sec.seats };
          Object.keys(updatedSeats).forEach(sk => {
            if (sk.startsWith(draggingRowLetter + '-')) {
              const seatObj = updatedSeats[sk];
              updatedSeats[sk] = {
                ...seatObj,
                offsetY: (seatObj.offsetY || 0) + movementY
              };
            }
          });
          return { ...sec, seats: updatedSeats };
        }
        return sec;
      }));
      return;
    }

    if (isRotating && selectedSectionId) {
      const boardEl = canvasRef.current.querySelector('.canvasBoard') || canvasRef.current;
      const rect = boardEl.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / (zoomLevel / 100);
      const mouseY = (e.clientY - rect.top) / (zoomLevel / 100);

      const radians = Math.atan2(mouseY - rotateCenter.y, mouseX - rotateCenter.x);
      let degrees = (radians * (180 / Math.PI)) + 90;

      setSections(sections.map(sec => 
        sec.id === selectedSectionId ? { ...sec, rotation: Math.round(degrees) } : sec
      ));
      return;
    }

    if (draggingId && viewMode === 'creator') {
      const newX = (e.clientX - dragOffset.x - panOffset.x) / (zoomLevel / 100);
      const newY = (e.clientY - dragOffset.y - panOffset.y) / (zoomLevel / 100);
      
      if (selectedSectionId) {
        setSections(sections.map(sec => sec.id === draggingId ? { ...sec, x: Math.max(0, newX), y: Math.max(0, newY) } : sec));
      } else if (selectedShapeId) {
        setShapes(shapes.map(sh => sh.id === draggingId ? { ...sh, x: Math.max(0, newX), y: Math.max(0, newY) } : sh));
      }
      return;
    }

    if (selectionBox) {
      const rect = e.currentTarget.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - panOffset.x) / (zoomLevel / 100);
      const currentY = (e.clientY - rect.top - panOffset.y) / (zoomLevel / 100);
      setSelectionBox({ ...selectionBox, currentX, currentY });
      return;
    }

    if (isDrawing && drawStart) {
      const boardEl = canvasRef.current.querySelector('.canvasBoard') || e.currentTarget;
      const rect = boardEl.getBoundingClientRect();

      let current_x = (e.clientX - rect.left) / (zoomLevel / 100);
      let current_y = (e.clientY - rect.top) / (zoomLevel / 100);

      if (e.shiftKey) {
        current_x = Math.round(current_x / 25) * 25;
        current_y = Math.round(current_y / 25) * 25;
      }

      setDrawCurrent({ x: current_x, y: current_y });
    }
  };

const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setIsRotating(false);
    setIsShapeRotating(false);
    setDraggingId(null);
    setDraggingSeatKey(null);
    setDraggingRowLetter(null);
    setSelectionBox(null);
    setResizingShapeId(null);
    setResizingBlockId(null);
    setResizeHandle(null);
  

    if (isDrawing && drawStart && drawCurrent) {
      const delta_x = drawCurrent.x - drawStart.x;
      const delta_y = drawCurrent.y - drawStart.y;
      
      const boxSize = 22;
      const seatSpacing = 2;
      const rowSpacing = 2;

      const calculatedSeats = activeTool === 'addRow' ? Math.max(2, Math.floor(Math.abs(delta_x) / (boxSize + seatSpacing)) + 1) : Math.max(1, Math.floor(Math.abs(delta_x) / (boxSize + seatSpacing)) + 1);
      const calculatedRows = activeTool === 'addRow' ? 1 : Math.max(1, Math.floor(Math.abs(delta_y) / (boxSize + rowSpacing)) + 1);

      if (['addSquare', 'addRectangle', 'addCircle', 'addText', 'stage', 'entrance', 'exit', 'emergency', 'toilet'].includes(activeTool)) {
        const newShId = Date.now();
        const startX = Math.min(drawStart.x, drawCurrent.x);
        const startY = Math.min(drawStart.y, drawCurrent.y);

        let shapeType = 'rectangle';
        let initialWidth = Math.max(60, Math.abs(delta_x));
        let initialHeight = Math.max(40, Math.abs(delta_y));
        let labelText = '';

        if (activeTool === 'stage') {
          shapeType = 'stage';
          labelText = 'Stage / Screen';
          initialWidth = Math.max(180, Math.abs(delta_x));
          initialHeight = 40;
        } else if (activeTool === 'entrance') {
          shapeType = 'entrance';
          labelText = 'Entrance';
          initialWidth = 100;
          initialHeight = 35;
        } else if (activeTool === 'exit') {
          shapeType = 'exit';
          labelText = 'Exit Gate';
          initialWidth = 100;
          initialHeight = 35;
        } else if (activeTool === 'emergency') {
          shapeType = 'emergency';
          labelText = 'Emergency Exit';
          initialWidth = 120;
          initialHeight = 35;
        } else if (activeTool === 'toilet') {
          shapeType = 'toilet';
          labelText = 'Toilet';
          initialWidth = 80;
          initialHeight = 40;
        } else if (activeTool === 'addSquare') {
          shapeType = 'square';
          const dim = Math.max(40, Math.abs(delta_x), Math.abs(delta_y));
          initialWidth = dim;
          initialHeight = dim;
        } else if (activeTool === 'addCircle') {
          shapeType = 'circle';
          const dim = Math.max(40, Math.abs(delta_x), Math.abs(delta_y));
          initialWidth = dim;
          initialHeight = dim;
       } else if (activeTool === 'addText') {
          shapeType = 'text';
          labelText = ''; // Blank by default when added
          initialWidth = 140;
          initialHeight = 40;
        }

      const newShape = {
          id: newShId,
          pageId: activePageId,
          type: shapeType,
          text: labelText,
          color: '#1e293b',
          fontSize: 14,
          x: startX,
          y: startY,
          width: initialWidth,
          height: initialHeight
        };
        pushHistory(sections, [...shapes, newShape]);
        setSelectedShapeId(newShId);
        setIsDrawing(false);
        setDrawStart(null);
        setDrawCurrent(null);
        setActiveTool(null); // Resets tool after one-time drawing use
        return;
      }

      const newId = Date.now();
      const newSec = {
        id: newId,
        pageId: activePageId,
        zoneId: activeZoneId,
        category: '', 
        price: 1500,
        rows: calculatedRows,
        seatsPerRow: calculatedSeats,
        x: Math.min(drawStart.x, drawCurrent.x),
        y: Math.min(drawStart.y, drawCurrent.y),
        rowSpacing: 2,
        seatSpacing: 2,
        rotation: 0,
        showRowNumbersLeft: true,
        showRowNumbersRight: true,
        rowNumberingType: '1, 2, 3, ...',
        rowStartingAt: 1,
        rowReversed: false,
        seatNumberingType: '1, 2, 3, ...',
        seatStartingAt: 1,
        seatReversed: false,
        seatLabelFormat: 'Seat %s',
        boxSize: 22,
        seatRadius: 4,
        seats: generateSeats(calculatedRows, calculatedSeats, '1, 2, 3, ...', 1, false, '1, 2, 3, ...', 1, false, '')
      };

      pushHistory([...sections, newSec], shapes);
      setSelectedSectionId(newId);
      setIsDrawing(false);
      setDrawStart(null);
      setDrawCurrent(null);
    }
  };

  const handleSeatClick = (secId, seatKey, e) => {
    e.stopPropagation();
    if (activeTool === 'selectSeat') {
      setSelectedSeatKey(seatKey);
      setSelectedSectionId(secId);
      return;
    }

    setSections(sections.map(sec => {
      if (sec.id === secId) {
        const currentSeat = sec.seats[seatKey];
        let nextStatus = 'available';
        if (currentSeat.status === 'available') nextStatus = 'blocked';
        else if (currentSeat.status === 'blocked') nextStatus = 'wheelchair';
        else if (currentSeat.status === 'wheelchair') nextStatus = 'sold';
        else nextStatus = 'available';

        return {
          ...sec,
          seats: { ...sec.seats, [seatKey]: { ...currentSeat, status: nextStatus } }
        };
      }
      return sec;
    }));
  };


const handleAddShape = (type, defaultText, w, h) => {
    const newShId = Date.now();
    const count = shapes.length;
    const newShape = {
      id: newShId,
      pageId: activePageId,
      type: type,
      text: defaultText,
      color: '#1e293b',
      fontSize: 14,
      x: (activePage.width / 2) - (w / 2) + ((count % 5) * 20),
      y: (activePage.height / 2) - (h / 2) + ((count % 5) * 20), // Appears in the middle
      width: w,
      height: h
    };
    pushHistory(sections, [...shapes, newShape]);
    setSelectedShapeId(newShId);
    setActiveTool(null);
  };


const handlePropertyChange = (field, value) => {
    if (selectedSeatKey && activeSection && field === 'category') {
      const updatedSeats = {
        ...activeSection.seats,
        [selectedSeatKey]: {
          ...activeSection.seats[selectedSeatKey],
          category: value
        }
      };
      setSections(sections.map(sec => sec.id === activeSection.id ? { ...sec, seats: updatedSeats } : sec));
      return;
    }

    if (activeSection) {
      setSections(sections.map(sec => {
        if (sec.id === selectedSectionId) {
          let updatedSec = { ...sec, [field]: value };
          if (field === 'category') {
            Object.keys(updatedSec.seats).forEach(sk => {
              updatedSec.seats[sk] = { ...updatedSec.seats[sk], category: value };
            });
          }
          if (['rows', 'seatsPerRow', 'rowNumberingType', 'rowStartingAt', 'rowReversed', 'seatNumberingType', 'seatStartingAt', 'seatReversed'].includes(field)) {
            updatedSec.seats = generateSeats(
              updatedSec.rows, 
              updatedSec.seatsPerRow, 
              updatedSec.rowNumberingType, 
              updatedSec.rowStartingAt, 
              updatedSec.rowReversed, 
              updatedSec.seatNumberingType, 
              updatedSec.seatStartingAt, 
              updatedSec.seatReversed,
              updatedSec.category
            );
          }
          return updatedSec;
        }
        return sec;
      }));
    } else if (activeShape) {
      // Ensure this updates the shape property properly
      setShapes(shapes.map(sh => sh.id === selectedShapeId ? { ...sh, [field]: value } : sh));
    }
  };

  const handleSaveMap = async () => {
    try {
      const payload = { zones, sections, shapes, pages, customCategories };
      await API.post('/events/seatmap', payload);
      alert('Seat map successfully saved to Database!');
    } catch (err) {
      console.error('API Save Error:', err);
      alert('Failed to save. Please make sure your backend server endpoint /events/seatmap is active.');
    }
  };

  const totalSeats = sections.reduce((acc, s) => acc + Object.keys(s.seats).length, 0);

  let previewRows = 1;
  let previewSeats = 1;
  if (isDrawing && drawStart && drawCurrent) {
    const delta_x = drawCurrent.x - drawStart.x;
    const delta_y = drawCurrent.y - drawStart.y;
    const boxSize = 22;
    const seatSpacing = 2;
    const rowSpacing = 2;
    previewSeats = activeTool === 'addRow' ? Math.max(2, Math.floor(Math.abs(delta_x) / (boxSize + seatSpacing)) + 1) : Math.max(1, Math.floor(Math.abs(delta_x) / (boxSize + seatSpacing)) + 1);
    previewRows = activeTool === 'addRow' ? 1 : Math.max(1, Math.floor(Math.abs(delta_y) / (boxSize + rowSpacing)) + 1);
  }

  return (
    <div className={`${seatMapWrapper} h-screen overflow-hidden flex flex-col bg-slate-50`}>
      
      {/* PRINT & DOWNLOAD MEDIA QUERY STYLING */}
      <style>{`
        @media print {
          body, html {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          header, footer, .bg-slate-100, aside, .fixed, [class*="print:hidden"] {
            display: none !important;
          }
          .printable-canvas-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: #ffffff !important;
            z-index: 9999999 !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
          }
          .canvasBoard {
            transform: scale(0.85) !important;
            position: relative !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
<header className={`${seatMapHeader} print:hidden h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0`}>
	  <div className="flex flex-col">
	    <span className="font-extrabold text-slate-900 text-sm tracking-tight">showishere</span>
	    <span className="text-[11px] text-slate-500 font-medium">Seat Map Creator • Mahajati Sadan — Main Auditorium</span>
	  </div>

	  <div className="flex items-center space-x-2">
	    {/* <button 
	      onClick={() => {
	        if (window.confirm("Are you sure you want to clear all sections and shapes?")) {
	          pushHistory([], []);
	        }
	      }}
	      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded border border-slate-200 text-xs cursor-pointer shadow-xs"
	    >
	      Clear Map
	    </button> */}

	   <button 
	      onClick={() => setViewMode(viewMode === 'creator' ? 'preview' : 'creator')}
	      disabled={isEmpty}
	      className={`px-4 py-1.5 font-bold rounded shadow-xs text-xs ${
	        isEmpty ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
	      }`}
	    >
	      {viewMode === 'creator' ? 'Preview' : 'Creator'}
	    </button>
	  </div>
	</header>
  {/* headerbar menu */}
{/* headerbar menu */}
  <header className={`${seatMapHeader} print:hidden h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0 overflow-hidden`}>
      {/* LEFT: TOOLS, ZOOM, AND NEW PAGE BUTTON */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* FILE / DOWNLOAD ICONS */}
        <div className="flex items-center space-x-1">
          {viewMode === 'creator' && (
            <button
              onClick={() => {
                if (isEmpty || window.confirm("Do you want to start a new plan? Your current plan will be discarded.")) {
                  const newPId = `page-${Date.now()}`;
                  setPages([{ id: newPId, name: 'Plan 1', width: 900, height: 1200 }]);
                  setActivePageId(newPId);
                  pushHistory([], []);
                }
              }}
              title="Add New Page"
              className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-file-earmark-plus w-[18px] h-[18px]" viewBox="0 0 16 16">
                <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5"/>
                <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
              </svg>
            </button>
          )}
          <button 
            onClick={() => window.print()} 
            disabled={isEmpty} 
            title="Download / Export PDF" 
            className={`p-1.5 rounded text-xs flex items-center justify-center border border-transparent ${
              isEmpty ? 'opacity-30 cursor-not-allowed text-slate-400' : 'cursor-pointer hover:border-slate-300 bg-transparent text-slate-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        </div>

        {viewMode === 'creator' && (
          <>
            <div className="h-5 w-[1px] bg-slate-300"></div>

            {/* UNDO / REDO */}
            <div className={`flex items-center space-x-1 ${isEmpty ? 'pointer-events-none opacity-40' : ''}`}>
              <button onClick={handleUndo} disabled={isEmpty || history.length === 0} title="Undo (Ctrl+Z)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button onClick={handleRedo} disabled={isEmpty || redoStack.length === 0} title="Redo (Ctrl+Shift+Z)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a5 5 0 00-5 5v2m15-7l-6 6m6-6l-6-6" /></svg>
              </button>
            </div>

            <div className="h-5 w-[1px] bg-slate-300"></div>

            {/* EDIT ACTIONS: CUT, COPY, PASTE, DUPLICATE, DELETE */}
            <div className={`flex items-center space-x-1 ${isEmpty ? 'pointer-events-none opacity-40' : ''}`}>
              <button onClick={handleCut} disabled={isEmpty} title="Cut (Ctrl+X)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></svg>
              </button>
              
              <button onClick={handleCopy} disabled={isEmpty} title="Copy (Ctrl+C)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              </button>

              <button 
                onClick={handlePaste} 
                disabled={isEmpty || !clipboard} 
                title="Paste (Ctrl+V)" 
                className={`p-1.5 rounded text-xs flex items-center justify-center border border-transparent ${
                  !isEmpty && clipboard ? 'cursor-pointer hover:border-slate-300 text-slate-700 bg-transparent' : 'opacity-40 cursor-not-allowed text-slate-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </button>

              <button onClick={handleDuplicate} disabled={isEmpty} title="Duplicate (Ctrl+D)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </button>
              <button onClick={handleDeleteSelected} disabled={isEmpty} title="Delete (Del)" className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </>
        )}

        <div className="h-5 w-[1px] bg-slate-300"></div>

        {/* ZOOM CONTROLS (Always Active) */}
        <div className="bg-slate-100 rounded px-1.5 py-0.5 flex items-center space-x-1 text-[11px]">
          <button onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))} className="p-0.5 rounded cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
            </svg>
          </button>
          <span className="font-bold text-slate-800 w-8 text-center">{zoomLevel}%</span>
          <button onClick={() => setZoomLevel(Math.min(300, zoomLevel + 10))} className="p-0.5 rounded cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-300 bg-transparent text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
            </svg>
          </button>
        </div>
      </div>
  </header>

      {/* CREATE NEW ZONE MODAL POPUP */}
      {showNewZoneModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <button onClick={() => setShowNewZoneModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">✕</button>
            <h2 className="text-xl font-extrabold text-slate-900 text-center mb-6">Create a new zone</h2>
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Name</label>
              <input type="text" value={newZoneNameInput} onChange={(e) => setNewZoneNameInput(e.target.value)} placeholder="First floor" className={inputFieldStyle} autoFocus />
            </div>
            <button onClick={() => {
              if (newZoneNameInput.trim()) {
                const newZId = `zone-${Date.now()}`;
                setZones([...zones, { id: newZId, name: newZoneNameInput.trim() }]);
                setActiveZoneId(newZId);
                setNewZoneNameInput('');
                setShowNewZoneModal(false);
              }
            }} className={primaryButton}>CREATE</button>
          </div>
        </div>
      )}

      {/* CREATE NEW CATEGORY/COLOR MODAL POPUP */}
      {showNewCategoryModal && (
        <div className={modalOverlay}>
          <div className={modalBox}>
            <button onClick={() => setShowNewCategoryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">✕</button>
            <h2 className="text-lg font-extrabold text-slate-900 text-center mb-4">Add Custom Category</h2>
            <div className="space-y-3 mb-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Category Name</label>
                <input type="text" value={newCatNameInput} onChange={(e) => setNewCatNameInput(e.target.value)} placeholder="e.g. Balcony VIP" className={inputFieldStyle} autoFocus />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Color / Gradient Picker</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={newCatColorInput} onChange={(e) => setNewCatColorInput(e.target.value)} className="w-10 h-8 rounded border border-slate-300 cursor-pointer p-0.5 bg-white" />
                  <input type="text" value={newCatColorInput} onChange={(e) => setNewCatColorInput(e.target.value)} className="flex-1 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 font-mono text-xs" placeholder="Hex or linear-gradient(...)" />
                </div>
              </div>
            </div>
            <button onClick={() => {
              if (newCatNameInput.trim()) {
                setCustomCategories([...customCategories, { name: newCatNameInput.trim(), color: newCatColorInput }]);
                setNewCatNameInput('');
                setShowNewCategoryModal(false);
              }
            }} className={primaryButton}>Add Category</button>
          </div>
        </div>
      )}

   

      {/* MAIN BODY AREA WITH INDEPENDENTLY SCROLLABLE LEFT, CENTER, AND RIGHT PANELS */}
      <div className={`${seatMapBody} flex-1 flex overflow-hidden relative`}>
        
     {/* LEFT SIDEBAR: INDEPENDENTLY SCROLLABLE */}
    {viewMode === 'creator' && (
      <aside className="w-30 bg-white border-r border-slate-200 flex flex-col p-2 shrink-0 overflow-y-auto select-none print:hidden h-full">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 px-1">TOOLS</span>
        
  <div className="grid grid-cols-2 gap-1.5 mb-1">
    <button 
      onClick={() => setActiveTool('selectRow')} 
      title="Select Row (V)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'selectRow' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50" fill="currentColor">
        <path d="M 29.699219 47 C 29.578125 47 29.457031 46.976563 29.339844 46.933594 C 29.089844 46.835938 28.890625 46.644531 28.78125 46.398438 L 22.945313 32.90625 L 15.683594 39.730469 C 15.394531 40.003906 14.96875 40.074219 14.601563 39.917969 C 14.238281 39.761719 14 39.398438 14 39 L 14 6 C 14 5.601563 14.234375 5.242188 14.601563 5.082031 C 14.964844 4.925781 15.390625 4.996094 15.683594 5.269531 L 39.683594 27.667969 C 39.972656 27.9375 40.074219 28.355469 39.945313 28.726563 C 39.816406 29.101563 39.480469 29.363281 39.085938 29.398438 L 28.902344 30.273438 L 35.007813 43.585938 C 35.117188 43.824219 35.128906 44.101563 35.035156 44.351563 C 34.941406 44.601563 34.757813 44.800781 34.515625 44.910156 L 30.113281 46.910156 C 29.980469 46.96875 29.84375 47 29.699219 47 Z"></path>
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('selectSeat')} 
      title="Select Seat (S)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'selectSeat' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50" fill="currentColor">
        <path d="M 14.78125 5 C 14.75 5.007813 14.71875 5.019531 14.6875 5.03125 C 14.644531 5.050781 14.601563 5.070313 14.5625 5.09375 C 14.550781 5.09375 14.542969 5.09375 14.53125 5.09375 C 14.511719 5.101563 14.488281 5.113281 14.46875 5.125 C 14.457031 5.136719 14.449219 5.144531 14.4375 5.15625 C 14.425781 5.167969 14.417969 5.175781 14.40625 5.1875 C 14.375 5.207031 14.34375 5.226563 14.3125 5.25 C 14.289063 5.269531 14.269531 5.289063 14.25 5.3125 C 14.238281 5.332031 14.226563 5.355469 14.21875 5.375 C 14.183594 5.414063 14.152344 5.457031 14.125 5.5 C 14.113281 5.511719 14.105469 5.519531 14.09375 5.53125 C 14.09375 5.542969 14.09375 5.550781 14.09375 5.5625 C 14.082031 5.582031 14.070313 5.605469 14.0625 5.625 C 14.050781 5.636719 14.042969 5.644531 14.03125 5.65625 C 14.03125 5.675781 14.03125 5.699219 14.03125 5.71875 C 14.019531 5.757813 14.007813 5.800781 14 5.84375 C 14 5.875 14 5.90625 14 5.9375 C 14 5.949219 14 5.957031 14 5.96875 C 14 5.980469 14 5.988281 14 6 C 13.996094 6.050781 13.996094 6.105469 14 6.15625 L 14 39 C 14.003906 39.398438 14.242188 39.757813 14.609375 39.914063 C 14.972656 40.070313 15.398438 39.992188 15.6875 39.71875 L 22.9375 32.90625 L 28.78125 46.40625 C 28.890625 46.652344 29.09375 46.847656 29.347656 46.941406 C 29.601563 47.035156 29.882813 47.023438 30.125 46.90625 L 34.5 44.90625 C 34.996094 44.679688 35.21875 44.09375 35 43.59375 L 28.90625 30.28125 L 39.09375 29.40625 C 39.496094 29.378906 39.84375 29.113281 39.976563 28.730469 C 40.105469 28.347656 39.992188 27.921875 39.6875 27.65625 L 15.84375 5.4375 C 15.796875 5.378906 15.746094 5.328125 15.6875 5.28125 C 15.648438 5.234375 15.609375 5.195313 15.5625 5.15625 C 15.550781 5.15625 15.542969 5.15625 15.53125 5.15625 C 15.511719 5.132813 15.492188 5.113281 15.46875 5.09375 C 15.457031 5.09375 15.449219 5.09375 15.4375 5.09375 C 15.386719 5.070313 15.335938 5.046875 15.28125 5.03125 C 15.269531 5.03125 15.261719 5.03125 15.25 5.03125 C 15.230469 5.019531 15.207031 5.007813 15.1875 5 C 15.175781 5 15.167969 5 15.15625 5 C 15.136719 5 15.113281 5 15.09375 5 C 15.082031 5 15.074219 5 15.0625 5 C 15.042969 5 15.019531 5 15 5 C 14.988281 5 14.980469 5 14.96875 5 C 14.9375 5 14.90625 5 14.875 5 C 14.84375 5 14.8125 5 14.78125 5 Z M 16 8.28125 L 36.6875 27.59375 L 27.3125 28.40625 C 26.992188 28.4375 26.707031 28.621094 26.546875 28.902344 C 26.382813 29.179688 26.367188 29.519531 26.5 29.8125 L 32.78125 43.5 L 30.21875 44.65625 L 24.21875 30.8125 C 24.089844 30.515625 23.828125 30.296875 23.511719 30.230469 C 23.195313 30.160156 22.863281 30.25 22.625 30.46875 L 16 36.6875 Z"></path>
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('addRow')} 
      title="Add Row (N)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'addRow' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <circle cx="3" cy="12" r="2.5" />
        <circle cx="10" cy="12" r="2.5" />
        <path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" d="M19 9v6M16 12h6" />
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('addRowsBlock')} 
      title="Add Rows Block (Shift+N)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'addRowsBlock' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        <circle cx="5" cy="5" r="3" />
        <circle cx="11" cy="5" r="3" />
        <circle cx="5" cy="12" r="3" />
        <circle cx="11" cy="12" r="3" />
        <circle cx="5" cy="19" r="3" />
        <circle cx="11" cy="19" r="3" />
        <circle cx="17" cy="19" r="3" />
        <path stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" d="M18 5v6M15 8h6" />
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('addSquare')} 
      title="Square Box (M)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'addSquare' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('addRectangle')} 
      title="Rectangle Box (R)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'addRectangle' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <rect x="2" y="6" width="20" height="12" rx="2" />
      </svg>
    </button>

    <button 
      onClick={() => setActiveTool('addCircle')} 
      title="Circle / Oval (O)" 
      className={`p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border ${
        activeTool === 'addCircle' 
          ? 'border-blue-400 text-blue-600 bg-blue-50/50' 
          : 'border-transparent hover:border-slate-300 text-slate-700 bg-transparent'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
        <circle cx="12" cy="12" r="9" />
      </svg>
    </button>

   <button 
  onClick={() => handleAddShape('text', '', 140, 40)} 
  title="Text Field (T)" 
  className="p-1.5 rounded text-xs cursor-pointer flex items-center justify-center h-8 border border-transparent hover:border-slate-300 text-slate-700 bg-transparent"
>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[18px] h-[18px]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V5h16v2M12 5v14" />
  </svg>
</button>
  </div>

  <hr className="border-slate-200 my-2" />

   {/* ADD TO MAP SECTION */}
  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 px-1">ADD TO MAP</span>
<div className="space-y-0.5 w-full text-xs font-semibold text-slate-700 mb-6">
  <button type="button" onClick={() => handleAddShape('stage', 'Stage / Screen', 180, 40)} className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-2">
   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><rect x="3" y="5" width="18" height="14" rx="2" /></svg>
    <span className="truncate">Stage / Screen</span>
  </button>
  <button type="button" onClick={() => handleAddShape('entrance', 'Entrance', 100, 35)} className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0">
      <path fillRule="evenodd" d="M6.364 13.5a.5.5 0 0 0 .5.5H13.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 13.5 1h-10A1.5 1.5 0 0 0 2 2.5v6.636a.5.5 0 1 0 1 0V2.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H6.864a.5.5 0 0 0-.5.5"/>
      <path fillRule="evenodd" d="M11 5.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793l-8.147 8.146a.5.5 0 0 0 .708.708L10 6.707V10.5a.5.5 0 0 0 1 0z"/>
    </svg>
    <span className="truncate">Entrance</span>
  </button>
  <button type="button" onClick={() => handleAddShape('exit', 'Exit Gate', 100, 35)} className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0">
      <path fillRule="evenodd" d="M7.364 12.5a.5.5 0 0 0 .5.5H14.5a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 14.5 0h-10A1.5 1.5 0 0 0 3 1.5v6.636a.5.5 0 1 0 1 0V1.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H7.864a.5.5 0 0 0-.5.5"/>
      <path fillRule="evenodd" d="M0 15.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1H1.707l8.147-8.146a.5.5 0 0 0-.708-.708L1 14.293V10.5a.5.5 0 0 0-1 0z"/>
    </svg>
    <span className="truncate">Exit Gate</span>
  </button>
  <button type="button" onClick={() => handleAddShape('emergency', 'Emergency Exit', 120, 35)} className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0">
      <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
      <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
    </svg>
    <span className="truncate">Emergency Exit</span>
  </button>
  <button type="button" onClick={() => handleAddShape('toilet', 'Toilet', 80, 40)} className="w-full text-left px-2 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-2">
    <svg width="14" height="14" viewBox="0 0 650 650" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-3.5 h-3.5 shrink-0"> 
      <circle cx="182" cy="107" r="46" stroke="currentColor" strokeWidth="36" /> 
      <path d=" M114 168 H250 C270 168 284 185 284 205 V326 C284 344 274 357 258 357 C242 357 238 344 238 326 V248 H238 V474 C238 499 228 515 211 515 C194 515 183 500 183 475 V363 H178 V475 C178 500 168 515 151 515 C134 515 125 499 125 474 V248 H125 V326 C125 344 120 357 103 357 C87 357 81 344 81 326 V205 C81 185 94 168 114 168 Z " stroke="currentColor" strokeWidth="36" strokeLinejoin="round" strokeLinecap="round" /> 
      <line x1="323" y1="66" x2="323" y2="514" stroke="currentColor" strokeWidth="40" /> 
      <circle cx="467" cy="107" r="46" stroke="currentColor" strokeWidth="36" /> 
      <path d=" M421 168 H513 C524 168 533 175 538 187 L588 309 C594 324 587 338 574 335 C563 332 557 326 552 315 L516 246 L572 386 H523 V474 C523 499 513 515 496 515 C479 515 469 500 469 475 V386 H464 V475 C464 500 454 515 437 515 C420 515 410 499 410 474 V386 H361 L418 246 L382 315 C377 326 371 332 360 335 C347 338 340 324 346 309 L396 187 C401 175 410 168 421 168 Z " stroke="currentColor" strokeWidth="36" strokeLinejoin="round" strokeLinecap="round" /> 
      <path d="M418 246 L388 315" stroke="currentColor" strokeWidth="36" strokeLinecap="round" /> 
      <path d="M516 246 L546 315" stroke="currentColor" strokeWidth="36" strokeLinecap="round" /> 
    </svg>
    <span className="truncate">Toilet</span>
  </button>
</div>

  {/* QUICK TIP BOX */}
  <div className="bg-slate-50 border border-slate-200 rounded p-2 text-[9px] text-slate-600 space-y-0.5 mb-2">
    <p className="font-bold text-slate-800">Quick tip</p>
    <p>• Place Stage / Screen first</p>
    <p>• Add sections -&gt; rows -&gt; seats</p>
    <p>• Select seats or rows to edit</p>
    <p>• Add aisles &amp; facilities</p>
    <p>• Set category &amp; price</p>
    <p>• Preview before saving</p>
  </div>
      </aside>
    )}

 <main 
          ref={canvasRef}
          className={`${seatMapCanvasArea} flex-1 relative overflow-auto bg-slate-200/60 printable-canvas-area flex items-center justify-center p-10 h-full`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={() => {
            setSelectedShapeId(null);
            setSelectedSectionId(null);
            setSelectedSeatKey(null);
          }}
        >
          {/* DESIGN PAGE (FIXED 3:4 ASPECT RATIO DIMENSIONS WITH PADDING SPACE AROUND IT) */}
          <div 
            className="canvasBoard bg-white shadow-xl relative overflow-hidden rounded-lg shrink-0"
            style={{ 
              width: `${activePage.width}px`,
              height: `${activePage.height}px`,
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel / 100})`, 
              transformOrigin: 'center center'
            }}
          >
            <div className={canvasGridBg}></div>

            {selectionBox && (
              <div 
                className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-40"
                style={{
                  left: `${Math.min(selectionBox.startX, selectionBox.currentX)}px`,
                  top: `${Math.min(selectionBox.startY, selectionBox.currentY)}px`,
                  width: `${Math.abs(selectionBox.currentX - selectionBox.startX)}px`,
                  height: `${Math.abs(selectionBox.currentY - selectionBox.startY)}px`,
                }}
              ></div>
            )}

            {/* LIVE SIMULTANEOUS DRAG PREVIEW FOR SHAPES */}
            {isDrawing && drawStart && drawCurrent && ['addSquare', 'addRectangle', 'addCircle', 'addText', 'stage', 'entrance', 'exit', 'emergency', 'toilet'].includes(activeTool) && (
              <div 
                className="absolute border-2 border-dashed border-blue-600 bg-blue-500/10 pointer-events-none z-50"
                style={{
                  left: `${Math.min(drawStart.x, drawCurrent.x)}px`,
                  top: `${Math.min(drawStart.y, drawCurrent.y)}px`,
                  width: `${Math.max(40, Math.abs(drawCurrent.x - drawStart.x))}px`,
                  height: `${activeTool === 'addSquare' || activeTool === 'addCircle' ? Math.max(40, Math.abs(drawCurrent.x - drawStart.x)) : Math.max(40, Math.abs(drawCurrent.y - drawStart.y))}px`,
                  borderRadius: activeTool === 'addCircle' ? '50%' : '0px'
                }}
              ></div>
            )}

            {/* LIVE SIMULTANEOUS DRAG SEAT MATRIX PREVIEW RENDERING */}
            {isDrawing && drawStart && drawCurrent && ['addRowsBlock', 'addRow'].includes(activeTool) && (
              <div 
                className="absolute pointer-events-none z-50 flex flex-col"
                style={{
                  left: `${Math.min(drawStart.x, drawCurrent.x)}px`,
                  top: `${Math.min(drawStart.y, drawCurrent.y)}px`,
                  gap: '2px'
                }}
              >
                {Array.from({ length: previewRows }).map((_, rIdx) => (
                  <div key={rIdx} className="flex" style={{ gap: '2px' }}>
                    {Array.from({ length: previewSeats }).map((_, sIdx) => (
                      <div 
                        key={sIdx}
                        style={{ width: '22px', height: '22px' }}
                        className="rounded-[4px] border border-slate-700 bg-white text-[9px] flex items-center justify-center font-medium text-slate-800 shadow-xs"
                      >
                        {sIdx + 1}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

          {pageShapes.map((sh) => {
                const isSelected = sh.id === selectedShapeId;
                const rotationAngle = sh.rotation || 0;

                return (
                  <div
                    key={sh.id}
                    onMouseDown={(e) => handleShapeMouseDown(e, sh.id)}
                   onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedShapeId(sh.id); 
                    setSelectedSectionId(null); 
                    setSelectedSeatKey(null); 
                    // Automatically activate inline editing if it's a text shape
                    if (sh.type === 'text') {
                      setShapes(shapes.map(s => s.id === sh.id ? { ...s, isEditing: true } : s));
                    }
                  }}
                   style={{
                        top: `${sh.y}px`,
                        left: `${sh.x}px`,
                        width: `${sh.width}px`,
                        minHeight: `${sh.height}px`,
                        position: 'absolute',
                        cursor: viewMode === 'preview' ? 'default' : 'move',
                        transform: `rotate(${rotationAngle}deg)`,
                        transformOrigin: 'center center',
                        zIndex: 25
                      }}
                        className={`select-none flex items-center justify-center border ${sh.type === 'circle' ? 'rounded-full' : 'rounded-none'} ${
                  isSelected && viewMode === 'creator'
                    ? 'border-blue-600 ring-2 ring-blue-300 bg-transparent font-bold shadow-md' 
                    : sh.type === 'text' 
                      ? 'border-transparent bg-transparent text-slate-800' 
                      : 'border-slate-400 bg-transparent text-slate-800'
                }`}
                  >
                    {sh.isEditing ? (
                      <input
                        type="text"
                        value={sh.text || ''}
                        autoFocus
                        onBlur={(e) => {
                          const val = e.target.value;
                          setShapes(shapes.map(s => s.id === sh.id ? { ...s, text: val, isEditing: false } : s));
                        }}
                        onChange={(e) => {
                          const val = e.target.value;
                          setShapes(shapes.map(s => s.id === sh.id ? { ...s, text: val } : s));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setShapes(shapes.map(s => s.id === sh.id ? { ...s, isEditing: false } : s));
                          }
                        }}
                        className="w-full h-full text-center bg-transparent border-none outline-none text-xs font-bold"
                      />
                    ) : (
                     <span 
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setShapes(shapes.map(s => s.id === sh.id ? { ...s, isEditing: true } : s));
                        }}
                        className="text-xs font-bold w-full text-center block"
                        style={{
                          color: sh.color || '#1e293b',
                          fontSize: `${sh.fontSize || 14}px`,
                          lineHeight: 'normal'
                        }}
                        title="Double click to edit text"
                      >
                        {sh.text}
                      </span>
                    )}

                    {isSelected && viewMode === 'creator' && (
                      <>
                        {/* Rotation Handle */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                          <div className="w-[1px] h-5 bg-blue-600"></div>
                          <div 
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              setIsShapeRotating(true);
                              setShapeRotateCenter({ x: sh.x + (sh.width / 2), y: sh.y + (sh.height / 2) });
                            }}
                            title="Click and drag to rotate shape"
                            className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow cursor-grab active:cursor-grabbing"
                          ></div>
                        </div>

                        {/* Corner Resize Handles */}
                        <div onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('nw'); }} className="absolute -top-1.5 -left-1.5 w-1.5 h-1.5 bg-white border border-blue-600 rounded-none cursor-nw-resize"></div>
                        <div onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('ne'); }} className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-white border border-blue-600 rounded-none cursor-ne-resize"></div>
                        <div onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('sw'); }} className="absolute -bottom-1.5 -left-1.5 w-1.5 h-1.5 bg-white border border-blue-600 rounded-none cursor-sw-resize"></div>
                        <div onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('se'); }} className="absolute -bottom-1.5 -right-1.5 w-1.5 h-1.5 bg-white border border-blue-600 rounded-none cursor-se-resize"></div>
                      </>
                    )}
                  </div>
                );
              })}

            {/* RENDER ALL SEATING SECTIONS */}
            {pageSections.map((sec) => {
              const isCurrentZone = (sec.zoneId || 'zone-1') === activeZoneId;
              const isSelected = sec.id === selectedSectionId && isCurrentZone;
              const rotationAngle = sec.rotation || 0;

              const rowCount = sec.rows;
              const seatCount = sec.seatsPerRow;
              const rowLabelsList = [];
              for (let r = 0; r < rowCount; r++) {
                rowLabelsList.push(getLabel(r, sec.rowNumberingType, sec.rowStartingAt, sec.rowReversed, rowCount));
              }

              return (
                <div 
                  key={sec.id}
                  onMouseDown={(e) => isCurrentZone && handleMouseDown(e, sec.id)}
                  onClick={() => { 
                    if (isCurrentZone) {
                      setSelectedSectionId(sec.id); 
                      setSelectedShapeId(null); 
                    } else {
                      setActiveZoneId(sec.zoneId || 'zone-1');
                      setSelectedSectionId(sec.id);
                    }
                  }}
                  style={{ 
                    top: `${sec.y}px`, 
                    left: `${sec.x}px`, 
                    position: 'absolute', 
                    padding: '8px',
                    transform: `rotate(${rotationAngle}deg)`,
                    transformOrigin: 'center center',
                    opacity: isCurrentZone ? 1 : 0.35, 
                    pointerEvents: viewMode === 'preview' ? 'auto' : (isCurrentZone || viewMode === 'creator' ? 'auto' : 'none')
                  }}
                  className={`absolute rounded bg-transparent ${viewMode === 'preview' ? 'cursor-default pointer-events-none' : isCurrentZone ? 'cursor-move' : 'cursor-pointer'} ${
                    isSelected && viewMode === 'creator' ? 'border border-dashed border-blue-500 z-30' : 'z-10'
                  }`}
                  title={isCurrentZone ? 'Active Zone' : 'Inactive Zone - Click to activate'}
                >
                  {isSelected && viewMode === 'creator' && isCurrentZone && (
                    <>
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto">
                        <div className="w-[1px] h-6 bg-blue-600"></div>
                        <div 
                          onMouseDown={(e) => handleRotateStart(e, sec)}
                          title="Click and drag to bend or tilt rows"
                          className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow cursor-grab active:cursor-grabbing"
                        ></div>
                      </div>

                      <div 
                        onMouseDown={(e) => { e.stopPropagation(); setResizingBlockId(sec.id); }}
                        title="Click and drag to expand box size and rows/columns"
                        className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 border-2 border-white rounded-full cursor-cell flex items-center justify-center text-white text-[10px] font-bold shadow z-40"
                      >
                        +
                      </div>
                    </>
                  )}

                  <div className="flex flex-col relative" style={{ gap: `${sec.rowSpacing || 2}px` }}>
                    {rowLabelsList.map((rowLabel) => {
                      const seatLabelsList = [];
                      for (let s = 0; s < seatCount; s++) {
                        seatLabelsList.push(getLabel(s, sec.seatNumberingType, sec.seatStartingAt, sec.seatReversed, seatCount));
                      }

                      return (
                        <div key={rowLabel} className="flex items-center justify-center relative" style={{ gap: `2px` }}>
                          
                          {sec.showRowNumbersLeft !== false && (
                            <span 
                              onMouseDown={(e) => isCurrentZone && handleRowMarkerMouseDown(e, sec.id, rowLabel)}
                              title="Click and drag to move row anywhere"
                              className={`text-[10px] font-medium w-4 text-right select-none ${isCurrentZone ? 'cursor-grab active:cursor-grabbing' : ''} z-10 ${selectedRowKey === rowLabel && isCurrentZone ? 'text-blue-600 font-bold underline' : 'text-slate-600'}`}
                            >
                              {rowLabel}
                            </span>
                          )}

                          <div className="flex z-10" style={{ gap: `${sec.seatSpacing || 2}px` }}>
                            {seatLabelsList.map((seatNumLabel) => {
                              const seatKey = `${rowLabel}-${seatNumLabel}`;
                              const seatData = sec.seats[seatKey] || { status: 'available', category: sec.category || '', offsetX: 0, offsetY: 0 };
                              const isSeatSelected = selectedSeatKey === seatKey && isSelected;
                              
                              let categoryColorBg = 'bg-white text-slate-800 border-slate-700';
                              const cat = seatData.category !== undefined ? seatData.category : sec.category;
                              const customCatObj = customCategories.find(c => c.name === cat);
                              if (customCatObj) {
                                categoryColorBg = 'text-white border-black/20';
                              } else if (cat === 'Category I') categoryColorBg = 'bg-[#f93822] text-white border-[#d92812]';
                              else if (cat === 'Category II') categoryColorBg = 'bg-[#c0392b] text-white border-[#a93226]';
                              else if (cat === 'Category III') categoryColorBg = 'bg-[#27ae60] text-white border-[#1e8449]';
                              else if (cat === 'Category IV') categoryColorBg = 'bg-[#2980b9] text-white border-[#1f618d]';
                              else if (cat === 'Category V') categoryColorBg = 'bg-[#16a085] text-white border-[#117a65]';

                              if (seatData.status === 'blocked') categoryColorBg = 'bg-slate-200 text-slate-400 border-slate-400';
                              if (seatData.status === 'sold') categoryColorBg = 'bg-rose-500 text-white border-rose-600';
                              if (seatData.status === 'wheelchair') categoryColorBg = 'bg-indigo-600 text-white border-indigo-700';
                              if (isSeatSelected) categoryColorBg += ' ring-2 ring-blue-500';

                              const boxSz = sec.boxSize || 22;
                              const seatOffsetX = seatData.offsetX || 0;
                              const seatOffsetY = seatData.offsetY || 0;

                              const inlineStyle = {
                                width: `${boxSz}px`, 
                                height: `${boxSz}px`,
                                borderRadius: `${sec.seatRadius ?? 4}px`,
                                transform: `translate(${seatOffsetX}px, ${seatOffsetY}px)`
                              };
                              if (customCatObj && seatData.status === 'available' && !isSeatSelected) {
                                if (customCatObj.color.includes('gradient')) {
                                  inlineStyle.backgroundImage = customCatObj.color;
                                } else {
                                  inlineStyle.backgroundColor = customCatObj.color;
                                }
                              }

                              return (
                                <div 
                                  key={seatKey} 
                                  title={`Seat ${seatKey} - Zone: ${zones.find(z => z.id === sec.zoneId)?.name || 'Ground floor'}`}
                                  onMouseDown={(e) => isCurrentZone && handleSeatMouseDown(e, sec.id, seatKey)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (viewMode === 'preview') return;
                                    if (!isCurrentZone) {
                                      setActiveZoneId(sec.zoneId || 'zone-1');
                                    } else {
                                      handleSeatClick(sec.id, seatKey, e);
                                    }
                                  }}
                                  style={inlineStyle}
                                  className={`text-[9px] flex items-center justify-center font-medium transition-transform ${viewMode === 'preview' ? 'cursor-default pointer-events-none' : 'hover:scale-110 cursor-pointer'} select-none border ${categoryColorBg}`}
                                >
                                  {seatData.status === 'wheelchair' ? '♿' : seatNumLabel}
                                </div>
                              );
                            })}
                          </div>

                          {sec.showRowNumbersRight !== false && (
                            <span className="text-[10px] font-medium w-4 text-left select-none pl-1 z-10 text-slate-600">{rowLabel}</span>
                          )}

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* RIGHT SIDE PROPERTIES PANEL: INDEPENDENTLY SCROLLABLE */}
        {viewMode === 'creator' && showRightSidebar && (
          <aside className={`${propertiesSidebar} w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto shrink-0 print:hidden text-xs h-full`}>
            
            {/* ZONES HEADER WITH FULL ZONE DELETE BUTTON */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1">
                  <span>Zones</span>
                  <span className="text-slate-400 cursor-help" title="Manage your venue floors and tiers">ⓘ</span>
                </span>
                <button 
                  onClick={() => setShowNewZoneModal(true)}
                  className="w-5 h-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded flex items-center justify-center text-xs cursor-pointer"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {zones.map(z => (
                  <div 
                    key={z.id}
                    onClick={() => setActiveZoneId(z.id)}
                    className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer group ${z.id === activeZoneId ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <span>❖ {z.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400">{sections.filter(s => (s.zoneId || 'zone-1') === z.id).length} blocks</span>
                      {zones.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFullDeleteZone(z.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 font-extrabold text-xs px-1 rounded transition opacity-60 group-hover:opacity-100 cursor-pointer"
                          title="Delete zone and its blocks"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200 my-3" />

            {selectedSeatKey && activeSection ? (
              <>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs mb-2 uppercase tracking-wider">Selected Seat Properties</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-blue-600">Seat Key: {selectedSeatKey}</span>
                      <p className="text-slate-500 text-[11px] mt-1">Select tool "Select Seat" to click and drag this seat independently.</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-600">Seat Category Color</label>
                        <button 
                          onClick={() => setShowNewCategoryModal(true)}
                          className="text-blue-600 font-bold text-xs hover:underline cursor-pointer"
                        >
                          + Add Custom Color
                        </button>
                      </div>
                      <select 
                        value={activeSection.seats[selectedSeatKey]?.category || activeSection.category || ''} 
                        onChange={(e) => handlePropertyChange('category', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1.5 w-full font-medium text-slate-800"
                      >
                        <option value="">⚪ Default (White)</option>
                        {customCategories.map((cat, idx) => (
                          <option key={idx} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={handleDeleteSelected}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2 rounded text-xs transition cursor-pointer"
                      >
                        Delete Seat
                      </button>
                      <button 
                        onClick={() => setSelectedSeatKey(null)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded text-xs transition cursor-pointer"
                      >
                        Deselect
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : activeSection ? (
              <div className="space-y-3 text-xs">
                
                {/* ROW SPACING & SEAT SPACING */}
                <div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block mb-2">Row</span>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Row spacing</span>
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button 
                          onClick={() => handlePropertyChange('rowSpacing', Math.max(0, (activeSection.rowSpacing || 2) - 1))}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-r border-slate-300 cursor-pointer font-bold"
                        >-</button>
                        <span className="px-2 text-center flex-1 font-semibold">{activeSection.rowSpacing ?? 2}</span>
                        <button 
                          onClick={() => handlePropertyChange('rowSpacing', (activeSection.rowSpacing || 2) + 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-300 cursor-pointer font-bold"
                        >+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Seat spacing</span>
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button 
                          onClick={() => handlePropertyChange('seatSpacing', Math.max(0, (activeSection.seatSpacing || 2) - 1))}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-r border-slate-300 cursor-pointer font-bold"
                        >-</button>
                        <span className="px-2 text-center flex-1 font-semibold">{activeSection.seatSpacing ?? 2}</span>
                        <button 
                          onClick={() => handlePropertyChange('seatSpacing', (activeSection.seatSpacing || 2) + 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-300 cursor-pointer font-bold"
                        >+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center pt-1">
                      <span className="text-slate-700">Show numbers</span>
                      <div className="flex items-center justify-end space-x-2">
                        <label className="text-[10px] text-slate-500">L</label>
                        <input 
                          type="checkbox" 
                          checked={activeSection.showRowNumbersLeft !== false} 
                          onChange={(e) => handlePropertyChange('showRowNumbersLeft', e.target.checked)}
                          className="w-4 h-4 accent-[#68228b] rounded cursor-pointer"
                        />
                        <label className="text-[10px] text-slate-500">R</label>
                        <input 
                          type="checkbox" 
                          checked={activeSection.showRowNumbersRight !== false} 
                          onChange={(e) => handlePropertyChange('showRowNumbersRight', e.target.checked)}
                          className="w-4 h-4 accent-[#68228b] rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* ROW NUMBERS SECTION */}
                <div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block mb-2">Row numbers</span>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Numbering</span>
                      <select 
                        value={activeSection.rowNumberingType || '1, 2, 3, ...'} 
                        onChange={(e) => handlePropertyChange('rowNumberingType', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-medium w-full"
                      >
                        <option value="1, 2, 3, ...">1, 2, 3</option>
                        <option value="roman">i, ii, iii</option>
                        <option value="capital">A, B, C</option>
                        <option value="small">a, b, c</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Starting at</span>
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button 
                          onClick={() => {
                            const cur = activeSection.rowStartingAt === '' || isNaN(Number(activeSection.rowStartingAt)) ? 1 : Number(activeSection.rowStartingAt);
                            handlePropertyChange('rowStartingAt', cur - 1);
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-r border-slate-300 cursor-pointer font-bold"
                          title="Decrease starting index"
                        >-</button>
                        <input 
                          type="text" 
                          value={activeSection.rowStartingAt ?? 1} 
                          onChange={(e) => {
                            const val = e.target.value;
                            handlePropertyChange('rowStartingAt', val === '' ? '' : (isNaN(Number(val)) ? val : Number(val)));
                          }}
                          className="w-12 bg-transparent text-center font-semibold outline-none text-xs"
                          placeholder="1"
                        />
                        <button 
                          onClick={() => {
                            const cur = activeSection.rowStartingAt === '' || isNaN(Number(activeSection.rowStartingAt)) ? 1 : Number(activeSection.rowStartingAt);
                            handlePropertyChange('rowStartingAt', cur + 1);
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-300 cursor-pointer font-bold"
                          title="Increase starting index"
                        >+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center pt-1">
                      <span className="text-slate-700">Reversed</span>
                      <div className="flex justify-end">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={activeSection.rowReversed || false} 
                            onChange={(e) => handlePropertyChange('rowReversed', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#68228b]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* SEAT NUMBERS SECTION */}
                <div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block mb-2">Seat numbers</span>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Numbering</span>
                      <select 
                        value={activeSection.seatNumberingType || '1, 2, 3, ...'} 
                        onChange={(e) => handlePropertyChange('seatNumberingType', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-medium w-full"
                      >
                        <option value="1, 2, 3, ...">1, 2, 3</option>
                        <option value="roman">i, ii, iii</option>
                        <option value="capital">A, B, C</option>
                        <option value="small">a, b, c</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Starting at</span>
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button 
                          onClick={() => {
                            const cur = activeSection.seatStartingAt === '' || isNaN(Number(activeSection.seatStartingAt)) ? 1 : Number(activeSection.seatStartingAt);
                            handlePropertyChange('seatStartingAt', cur - 1);
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-r border-slate-300 cursor-pointer font-bold"
                          title="Decrease starting index"
                        >-</button>
                        <input 
                          type="text" 
                          value={activeSection.seatStartingAt ?? 1} 
                          onChange={(e) => {
                            const val = e.target.value;
                            handlePropertyChange('seatStartingAt', val === '' ? '' : (isNaN(Number(val)) ? val : Number(val)));
                          }}
                          className="w-12 bg-transparent text-center font-semibold outline-none text-xs"
                          placeholder="1"
                        />
                        <button 
                          onClick={() => {
                            const cur = activeSection.seatStartingAt === '' || isNaN(Number(activeSection.seatStartingAt)) ? 1 : Number(activeSection.seatStartingAt);
                            handlePropertyChange('seatStartingAt', cur + 1);
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-300 cursor-pointer font-bold"
                          title="Increase starting index"
                        >+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center pt-1">
                      <span className="text-slate-700">Reversed</span>
                      <div className="flex justify-end">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={activeSection.seatReversed || false} 
                            onChange={(e) => handlePropertyChange('seatReversed', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#68228b]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* SEAT RADIUS & CATEGORY COLOR */}
                <div>
                  <span className="font-extrabold text-slate-900 uppercase tracking-wider block mb-2">Seat</span>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <span className="text-slate-700">Radius (px)</span>
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button 
                          onClick={() => {
                            const cur = activeSection.seatRadius === '' || isNaN(Number(activeSection.seatRadius)) ? 4 : Number(activeSection.seatRadius);
                            handlePropertyChange('seatRadius', Math.max(0, cur - 2));
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-r border-slate-300 cursor-pointer font-bold"
                          title="Decrease radius"
                        >-</button>
                        <input 
                          type="text" 
                          value={activeSection.seatRadius ?? 4} 
                          onChange={(e) => {
                            const val = e.target.value;
                            handlePropertyChange('seatRadius', val === '' ? '' : (isNaN(Number(val)) ? val : Number(val)));
                          }}
                          className="w-12 bg-transparent text-center font-semibold outline-none text-xs"
                          placeholder="4"
                        />
                        <button 
                          onClick={() => {
                            const cur = activeSection.seatRadius === '' || isNaN(Number(activeSection.seatRadius)) ? 4 : Number(activeSection.seatRadius);
                            handlePropertyChange('seatRadius', cur + 2);
                          }}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 border-l border-slate-300 cursor-pointer font-bold"
                          title="Increase radius"
                        >+</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 items-center pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Category</span>
                        <button 
                          onClick={() => setShowNewCategoryModal(true)}
                          className="w-4 h-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center text-[10px] cursor-pointer"
                          title="Add custom category color"
                        >
                          +
                        </button>
                      </div>
                      <select 
                        value={activeSection.category || ''} 
                        onChange={(e) => handlePropertyChange('category', e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-1 font-medium text-slate-800 w-full"
                      >
                        <option value="">⚪ Default (White)</option>
                        {customCategories.map((cat, idx) => (
                          <option key={idx} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            ) : activeShape ? (
              <>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs mb-2 uppercase tracking-wider">Text Field Formatting</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block  text-slate-600 mb-1 font-semibold">Text Content</label>
                      <input 
                        type="text" 
                        placeholder="Type here..."
                        value={activeShape.text || ''} 
                        onChange={(e) => handlePropertyChange('text', e.target.value)}
                        className="w-full border border-slate-300 rounded px-2 py-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Text Color</label>
                        <input 
                          type="color" 
                          value={activeShape.color || '#1e293b'} 
                          onChange={(e) => handlePropertyChange('color', e.target.value)}
                          className="w-full h-8 bg-slate-50 border border-slate-300 rounded cursor-pointer p-1"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Font Size</label>
                        <input 
                          type="number" 
                          min="10" max="72"
                          value={activeShape.fontSize || 14} 
                          onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleDeleteSelected}
                    className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    Delete Text Field
                  </button>
                </div>
              </>
           ) : activeShape ? (
              <>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs mb-2 uppercase tracking-wider">Shape & Text Properties</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1 font-semibold">Text Content</label>
                      <input 
                        type="text" 
                        value={activeShape.text || ''} 
                        onChange={(e) => handlePropertyChange('text', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Text Color</label>
                        <input 
                          type="color" 
                          value={activeShape.color || '#1e293b'} 
                          onChange={(e) => handlePropertyChange('color', e.target.value)}
                          className="w-full h-8 bg-slate-50 border border-slate-300 rounded cursor-pointer p-1"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Font Size</label>
                        <input 
                          type="number" 
                          min="10" max="72"
                          value={activeShape.fontSize || 14} 
                          onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Width</label>
                        <input 
                          type="number" 
                          value={activeShape.width} 
                          onChange={(e) => handlePropertyChange('width', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">Height</label>
                        <input 
                          type="number" 
                          value={activeShape.height} 
                          onChange={(e) => handlePropertyChange('height', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleDeleteSelected}
                    className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold py-2 rounded text-xs transition cursor-pointer"
                  >
                    Delete Selected Shape
                  </button>
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-xs italic text-center py-6">
                No object selected. Click an element on the canvas to edit its properties.
              </div>
            )}
          </aside>
        )}

      </div>

     {/* FIXED FOOTER SUMMARY BAR */}
      <footer className={`${seatMapFooter} bg-white border-t border-slate-200 h-12 px-6 flex items-center justify-between shrink-0 print:hidden text-xs z-50`}>
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-slate-900 text-sm">{totalSeats}</span>
            <span className="text-[10px] text-slate-500 font-medium">Total Seats</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-slate-900 text-sm">
              {sections.reduce((acc, s) => acc + Object.values(s.seats).filter(st => st.status === 'available').length, 0)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Available</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-extrabold text-slate-900 text-sm">
              {sections.reduce((acc, s) => acc + Object.values(s.seats).filter(st => st.status === 'sold' || st.status === 'blocked').length, 0)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Reserved</span>
          </div>

          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-5 rounded bg-[#4f46e5] inline-block shadow-xs"></span>
              <span className="text-slate-600 font-semibold">Regular</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-5 rounded bg-[#f59e0b] inline-block shadow-xs"></span>
              <span className="text-slate-600 font-semibold">Premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-5 rounded bg-[#8b5cf6] inline-block shadow-xs"></span>
              <span className="text-slate-600 font-semibold">VIP</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-5 rounded bg-[#10b981] inline-block shadow-xs"></span>
              <span className="text-slate-600 font-semibold">Accessible</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-5 rounded bg-[#94a3b8] inline-block shadow-xs"></span>
              <span className="text-slate-600 font-semibold">Reserved</span>
            </div>
          </div>
        </div>

      {viewMode === 'creator' && (
        <div className="flex items-center space-x-10">
          <button 
            onClick={handleSaveMap} 
            disabled={isEmpty}
            className={`font-bold px-4 py-2 rounded-md shadow transition text-xs ${
              isEmpty ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
            }`}
          >
            Save Map
          </button>

          <button 
            onClick={() => window.history.back()} 
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold px-4 py-2 rounded-md shadow-xs transition cursor-pointer text-xs"
          >
            Cancel
          </button>
        </div>
      )}
       </footer>

    </div>
  );
};

export default SeatMap;