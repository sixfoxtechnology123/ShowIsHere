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
      } else if (isCtrl && e.key.toLowerCase() === 'x') {
        handleDeleteSelected();
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
        if (key === 'v' && !isCtrl) setActiveTool('selectSeat');
        if (key === 's' && !isCtrl) setActiveTool('selectSeat');
        if (key === 'n' && !isCtrl) {
          if (e.shiftKey) setActiveTool('addRowsBlock');
          else setActiveTool('addRow');
        }
        if (key === 'm' && !isCtrl) setActiveTool('addSquare');
        if (key === 'r' && !isCtrl) setActiveTool('addRectangle');
        if (key === 'c' && !isCtrl) setActiveTool('addCircle');
        if (key === 'o' && !isCtrl) setActiveTool('addCircle');
        if (key === 'p' && !isCtrl) setActiveTool('addRowsBlock');
        if (key === 't' && !isCtrl) setActiveTool('addText');
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
        x: activeSection.x + 30,
        y: activeSection.y + 30
      };
      pushHistory([...sections, duplicatedSec], shapes);
      setSelectedSectionId(newId);
    } else if (activeShape) {
      const newId = Date.now();
      const duplicatedSh = {
        ...activeShape,
        id: newId,
        x: activeShape.x + 30,
        y: activeShape.y + 30
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
          labelText = 'Type text here...';
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

  {/* UNIFIED TOP BAR CONTAINING BOTH HEADER TOOLS AND PAGE TABS IN THE SAME ROW */}
      <header className={`${seatMapHeader} print:hidden h-12 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0`}>
        
        {/* LEFT & CENTER: ICON-ONLY TOOLS AND PAGE TABS IN ONE ROW */}
        <div className="flex items-center space-x-3 overflow-x-auto shrink-0">
          
          {/* FILE / DOWNLOAD ICONS */}
          <div className="flex items-center space-x-1">
            <button onClick={handleSaveMap} title="Save progress" className="p-1.5 hover:bg-slate-100 rounded text-slate-700 text-xs border border-slate-200 cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </button>
            <button onClick={() => window.print()} title="Download / Export PDF" className="p-1.5 hover:bg-slate-100 rounded text-slate-700 text-xs border border-slate-200 cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-300"></div>

          {/* UNDO / REDO */}
          <div className="flex items-center space-x-1">
            <button onClick={handleUndo} title="Undo (Ctrl+Z)" className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l6 6m-6-6l6-6" /></svg>
            </button>
            <button onClick={handleRedo} title="Redo (Ctrl+Shift+Z)" className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10H11a5 5 0 00-5 5v2m15-7l-6 6m6-6l-6-6" /></svg>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-300"></div>

          {/* EDIT ACTIONS: CUT, COPY, DUPLICATE, DELETE */}
          <div className="flex items-center space-x-1">
            <button onClick={() => { handleDeleteSelected(); }} title="Cut (Ctrl+X)" className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" /></svg>
            </button>
            <button onClick={() => { handleDuplicate(); }} title="Copy (Ctrl+C)" className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
            </button>
            <button onClick={handleDuplicate} title="Duplicate (Ctrl+D)" className="p-1.5 bg-white hover:bg-slate-100 rounded border border-slate-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h8M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" /><rect x="4" y="11" width="10" height="10" rx="2" /></svg>
            </button>
            <button onClick={handleDeleteSelected} title="Delete (Del)" className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded border border-rose-200 text-xs cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="h-5 w-[1px] bg-slate-300"></div>

          {/* PAGES TABS EMBEDDED IN THE SAME ROW */}
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-slate-500 uppercase text-[10px]">PAGES:</span>
            {pages.map(p => (
              <div key={p.id} className="flex items-center">
                {editingPageId === p.id ? (
                  <input
                    type="text"
                    value={editingPageName}
                    onChange={(e) => setEditingPageName(e.target.value)}
                    onBlur={() => {
                      if (editingPageName.trim()) {
                        setPages(pages.map(pg => pg.id === p.id ? { ...pg, name: editingPageName.trim() } : pg));
                      }
                      setEditingPageId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (editingPageName.trim()) {
                          setPages(pages.map(pg => pg.id === p.id ? { ...pg, name: editingPageName.trim() } : pg));
                        }
                        setEditingPageId(null);
                      }
                    }}
                    autoFocus
                    className="px-2 py-0.5 rounded border border-blue-500 bg-white text-xs font-bold w-20 outline-none"
                  />
                ) : (
                  <div 
                    onClick={() => setActivePageId(p.id)}
                    onDoubleClick={() => {
                      setEditingPageId(p.id);
                      setEditingPageName(p.name);
                    }}
                    className={`${p.id === activePageId ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'} px-2.5 py-1 rounded text-xs cursor-pointer flex items-center border`}
                    title="Double click to rename"
                  >
                    <span>📄 {p.name}</span>
                    {pages.length > 1 && (
                      <button onClick={(e) => handleDeletePage(p.id, e)} className="ml-1 text-slate-400 hover:text-rose-600 font-extrabold text-[10px]">✕</button>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                const newPId = `page-${Date.now()}`;
                const newPageName = `Plan ${pages.length + 1}`;
                setPages([...pages, { id: newPId, name: newPageName, width: 900, height: 1200 }]);
                setActivePageId(newPId);
              }}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold cursor-pointer border border-slate-200"
              title="Add New Page"
            >
              +
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: ZOOM CONTROLS, PREVIEW & PROPERTIES TOGGLE */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="bg-slate-100 border border-slate-200 rounded px-2 py-1 flex items-center space-x-1 text-xs">
            <button onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))} className="font-bold px-1 bg-white rounded border border-slate-300 cursor-pointer">-</button>
            <span className="font-bold text-slate-800 w-10 text-center">{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(Math.min(300, zoomLevel + 10))} className="font-bold px-1 bg-white rounded border border-slate-300 cursor-pointer">+</button>
          </div>

          <button 
            onClick={() => setViewMode(viewMode === 'creator' ? 'preview' : 'creator')}
            className={`text-xs font-bold px-2.5 py-1 rounded border cursor-pointer ${viewMode === 'preview' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'}`}
          >
            {viewMode === 'creator' ? '👁️ Preview' : '⚙️ Creator'}
          </button>

          {viewMode === 'creator' && (
            <button 
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`${sidebarToggleBtn} px-2.5 py-1 text-xs`}
              title="Toggle Properties Panel"
            >
              <span>Properties</span>
            </button>
          )}
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
      <aside className="w-40 bg-white border-r border-slate-200 flex flex-col p-2 shrink-0 overflow-y-auto select-none print:hidden h-full">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 px-1">TOOLS</span>
        
     {/* 2-COLUMN ICON GRID FOR TOOLS (CLEANER, INTUITIVE LAYOUT MATCHING YOUR REFERENCE UI) */}
          <div className="grid grid-cols-2 gap-1.5 mb-4">
            <button 
              onClick={() => setActiveTool('selectRow')} 
              title="Select Row (V)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'selectRow' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('selectSeat')} 
              title="Select Seat (S)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'selectSeat' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2z" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addRow')} 
              title="Add Row (N)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addRow' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="4" y="9" width="16" height="6" rx="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 10v4" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addRowsBlock')} 
              title="Add Rows Block (Shift+N)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addRowsBlock' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addSquare')} 
              title="Square Box (M)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addSquare' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addRectangle')} 
              title="Rectangle Box (R)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addRectangle' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="6" width="20" height="12" rx="2" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addCircle')} 
              title="Circle / Oval (C / O)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addCircle' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </button>

            <button 
              onClick={() => setActiveTool('addText')} 
              title="Text Field (T)" 
              className={`p-2 rounded border text-xs cursor-pointer flex items-center justify-center h-9 ${
                activeTool === 'addText' 
                  ? 'bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200' 
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7V5h16v2M12 5v14" />
              </svg>
            </button>
          </div>

        <hr className="border-slate-200 my-1.5" />

        {/* ADD TO MAP SECTION */}
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 px-1">ADD TO MAP</span>
        <div className="space-y-0.5 w-full text-[11px] font-semibold text-slate-700 mb-3">
          <button onClick={() => setActiveTool('stage')} className={`w-full text-left px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-1.5 ${activeTool === 'stage' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
            <span className="text-xs">▬</span><span className="truncate">Stage / Screen</span>
          </button>
          <button onClick={() => setActiveTool('entrance')} className={`w-full text-left px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-1.5 ${activeTool === 'entrance' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
            <span className="text-xs">↗</span><span className="truncate">Entrance</span>
          </button>
          <button onClick={() => setActiveTool('exit')} className={`w-full text-left px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-1.5 ${activeTool === 'exit' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
            <span className="text-xs">✓</span><span className="truncate">Exit Gate</span>
          </button>
          <button onClick={() => setActiveTool('emergency')} className={`w-full text-left px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-1.5 ${activeTool === 'emergency' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
            <span className="text-xs">⚠</span><span className="truncate">Emergency Exit</span>
          </button>
          <button onClick={() => setActiveTool('toilet')} className={`w-full text-left px-1.5 py-1 rounded hover:bg-slate-100 cursor-pointer flex items-center space-x-1.5 ${activeTool === 'toilet' ? 'bg-blue-50 text-blue-700 font-bold' : ''}`}>
            <span className="text-xs">🚻</span><span className="truncate">Toilet</span>
          </button>
        </div>

        {/* QUICK TIP BOX */}
        <div className="mt-auto bg-slate-50 border border-slate-200 rounded p-2 text-[9px] text-slate-600 space-y-0.5">
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

        {/* CANVAS WORKSPACE AREA: INDEPENDENTLY SCROLLABLE CENTER AREA */}
        <main 
          ref={canvasRef}
          className={`${seatMapCanvasArea} flex-1 relative overflow-auto bg-slate-200/60 printable-canvas-area flex items-center justify-center p-10 h-full`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
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

            {/* RENDER PAGE SHAPES & ELEMENTS */}
            {pageShapes.map((sh) => {
              const isSelected = sh.id === selectedShapeId;

              if (['stage', 'entrance', 'exit', 'emergency', 'toilet', 'text'].includes(sh.type)) {
                return (
                  <div
                    key={sh.id}
                    onMouseDown={(e) => handleShapeMouseDown(e, sh.id)}
                    onClick={() => { setSelectedShapeId(sh.id); setSelectedSectionId(null); setSelectedSeatKey(null); }}
                    style={{
                      top: `${sh.y}px`,
                      left: `${sh.x}px`,
                      width: `${sh.width}px`,
                      height: `${sh.height}px`,
                      position: 'absolute',
                      cursor: 'move',
                      zIndex: 25
                    }}
                    className={`p-1 select-none flex items-center justify-center border rounded ${isSelected ? 'border-blue-600 ring-2 ring-blue-300 bg-blue-50/80 font-bold' : 'border-slate-400 bg-white/90 text-slate-800'}`}
                  >
                    <span className="text-xs font-bold truncate">{sh.text || sh.type}</span>
                  </div>
                );
              }

              let shapeStyle = 'rounded-none bg-transparent';
              if (sh.type === 'square') shapeStyle = 'rounded-none aspect-square bg-transparent';
              if (sh.type === 'rectangle') shapeStyle = 'rounded-none bg-transparent';
              if (sh.type === 'circle') shapeStyle = 'rounded-full aspect-square bg-transparent';

              return (
                <div
                  key={sh.id}
                  onMouseDown={(e) => handleShapeMouseDown(e, sh.id)}
                  onClick={() => { setSelectedShapeId(sh.id); setSelectedSectionId(null); setSelectedSeatKey(null); }}
                  style={{
                    top: `${sh.y}px`,
                    left: `${sh.x}px`,
                    width: `${sh.width}px`,
                    height: `${sh.height}px`,
                    position: 'absolute'
                  }}
                  className={`border-2 ${isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-slate-600'} flex items-center justify-center cursor-move z-20 ${shapeStyle}`}
                >
                  <span className="text-xs font-bold text-slate-800 select-none">{sh.text || ''}</span>

                  {isSelected && viewMode === 'creator' && (
                    <>
                      <div 
                        onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('se'); }}
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-se-resize"
                      ></div>
                      <div 
                        onMouseDown={(e) => { e.stopPropagation(); setResizingShapeId(sh.id); setResizeHandle('nw'); }}
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-nw-resize"
                      ></div>
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
                    pointerEvents: isCurrentZone || viewMode === 'creator' ? 'auto' : 'none'
                  }}
                  className={`absolute rounded bg-transparent ${isCurrentZone ? 'cursor-move' : 'cursor-pointer'} ${
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
                                    if (!isCurrentZone) {
                                      setActiveZoneId(sec.zoneId || 'zone-1');
                                    } else {
                                      handleSeatClick(sec.id, seatKey, e);
                                    }
                                  }}
                                  style={inlineStyle}
                                  className={`text-[9px] flex items-center justify-center font-medium transition-transform hover:scale-110 cursor-pointer select-none border ${categoryColorBg}`}
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
            ) : activeShape && activeShape.type === 'text' ? (
              <>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs mb-2 uppercase tracking-wider">Text Field Formatting</h3>
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
                  <h3 className="font-extrabold text-slate-900 text-xs mb-2 uppercase tracking-wider">Shape Attributes</h3>
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
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

        <button 
          onClick={handleSaveMap} 
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-2 rounded-md shadow transition cursor-pointer text-xs"
        >
          Save Seat Map
        </button>
      </footer>

    </div>
  );
};

export default SeatMap;