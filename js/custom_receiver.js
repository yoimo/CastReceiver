"use strict";
import "../css/receiver.css";

const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

const LOG_RECEIVER_TAG = "Receiver";

let castDebugLogger;

if (DEBUG) {
  /**
   * Debug Logger
   */
  castDebugLogger = cast.debug.CastDebugLogger.getInstance();

  /**
   * WARNING: Make sure to turn off debug logger for production release as it
   * may expose details of your app.
   * Uncomment below line to enable debug logger and show a 'DEBUG MODE' tag at
   * top left corner.
   */
  castDebugLogger.setEnabled(true);

  /**
   * Uncomment below line to show debug overlay.
   */
  castDebugLogger.showDebugLogs(true);

  /**
   * Set verbosity level for Core events.
   */
  castDebugLogger.loggerLevelByEvents = {
    "cast.framework.events.category.CORE": cast.framework.LoggerLevel.INFO,
    "cast.framework.events.EventType.MEDIA_STATUS":
      cast.framework.LoggerLevel.DEBUG,
  };

  if (!castDebugLogger.loggerLevelByTags) {
    castDebugLogger.loggerLevelByTags = {};
  }

  /**
   * Set verbosity level for custom tag.
   * Enables log messages for error, warn, info and debug.
   */
  castDebugLogger.loggerLevelByTags[LOG_RECEIVER_TAG] =
    cast.framework.LoggerLevel.DEBUG;

  /**
   * Example of how to listen for events on playerManager.
   */
  playerManager.addEventListener(
    cast.framework.events.EventType.ERROR,
    (event) => {
      castDebugLogger.error(
        LOG_RECEIVER_TAG,
        "Detailed Error Code - " + event.detailedErrorCode
      );
      if (event && event.detailedErrorCode == 905) {
        castDebugLogger.error(
          LOG_RECEIVER_TAG,
          "LOAD_FAILED: Verify the load request is set up " +
            "properly and the media is able to play."
        );
      }
    }
  );
  castDebugLogger.debug(LOG_RECEIVER_TAG, "Version Of The Receiver 1");
} else {
  const noop = ()=> {};
  castDebugLogger = {
    debug: noop,
    error: noop,
    warn: noop,
  }
}




playerManager.setMessageInterceptor(
  cast.framework.messages.MessageType.LOAD,
  (loadRequestData) => {
    castDebugLogger.debug(
      LOG_RECEIVER_TAG,
      `LOAD interceptor loadRequestData: ${JSON.stringify(loadRequestData)}`
    );
    if (!loadRequestData || !loadRequestData.media) {
      const error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED
      );
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      castDebugLogger.error(LOG_RECEIVER_TAG, "Invalid load request");
      return error;
    } else {
      castDebugLogger.error(
        LOG_RECEIVER_TAG,
        "Request missing valid target: no contentUrl, contentId, or entity"
      );
    }

    return loadRequestData;
  }
);



context.start();