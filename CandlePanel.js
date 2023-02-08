const newCandlesPlottersCandlesVolumesCandlesCandlePanel = () => {
  const container = newContainer();
  container.initialize();
  container.frame.containerName = "Candle";
  let currentCandle;
  let upDownButton;

  return {
    fitFunction: undefined,
    container,
    isVisible: true,
    onRecordChange: lastCurrentCandle => {
      currentCandle = lastCurrentCandle;
    },
    draw: () => {
      if (!isVisible) return;
      container.frame.draw(false, false, true, fitFunction);
      plotCurrentCandleInfo();
      upDownButton.draw();
    },
    getContainer: point => {
      if (!isVisible) return;
      let result = upDownButton.getContainer(point);
      if (result) return result;
      if (container.frame.isThisPointHere(point, true)) {
        const checkPoint = fitFunction({ x: point.x, y: point.y });
        if (point.x === checkPoint.x && point.y === checkPoint.y) {
          return container;
        }
      }
    },
    initialize: () => {
      container.frame.width = UI_PANEL.WIDTH.NORMAL;
      container.frame.height = UI_PANEL.HEIGHT.NORMAL;
      container.frame.position.x =
        UI.projects.superalgos.spaces.chartingSpace.viewport.visibleArea.topRight.x -
        container.frame.width * 2;
      container.frame.position.y =
        UI.projects.superalgos.spaces.chartingSpace.viewport.visibleArea.bottomLeft.y -
        container.frame.height;
      upDownButton = newUpDownButton();
      upDownButton.parentContainer = container;
      upDownButton.container.frame.parentFrame = container.frame;
      upDownButton.fitFunction = fitFunction;
      upDownButton.initialize();
    },
    finalize: () => {
      container.finalize();
      upDownButton.finalize();
      [container, fitFunction, isVisible, currentCandle, upDownButton] = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      ];
    }
  };

  function plotCurrentCandleInfo() {
    if (!currentCandle || !currentCandle.innerCandle) return;
    const frameBodyHeight =
