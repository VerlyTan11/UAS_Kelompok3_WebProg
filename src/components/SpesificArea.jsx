import React from "react";
import { useGame } from "../context/useGame";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { activityDefinitions } from "../context/GameConstants";

// Komponen untuk menampilkan aktivitas yang sedang berlangsung
const ActivityPanel = ({ activityState, fastForwardActivity }) => {
  // Hanya ambil state dari props, karena semua Hooks sudah dipanggil di SpecificArea
  const { name, progress, message, animation, mode } = activityState;
  const activityName = name?.split(" - ")[1];

  // Jika tidak ada aktivitas yang berjalan, return null.
  if (!name) {
    return null;
  }

  // Tombol untuk mengaktifkan Fast Forward (jika mode normal)
  const renderActionButtons = () => {
    if (mode === "normal") {
      return (
        <Button
          variant="warning"
          className="mt-3 cursor-target"
          onClick={fastForwardActivity}
        >
          Fast Forward (Instant Finish)
        </Button>
      );
    }
    return null;
  };

  // Tampilan ketika aktivitas sedang berjalan (Progress Card)
  return (
    <Card
      className="position-absolute p-3 shadow-lg"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        zIndex: 200,
        textAlign: "center",
      }}
    >
      <h5 className="mb-3">
        Activity: {activityName} (
        {mode === "normal" ? "Normal Mode" : "Fast Forward"})
      </h5>
      <div style={{ fontSize: "3rem", marginBottom: "10px" }}>{animation}</div>
      <p>"{message}"</p>

      {mode === "normal" ? (
        <>
          <ProgressBar
            now={progress}
            label={`${Math.round(progress)}%`}
            className="mb-3"
          />
          <small className="text-muted">
            Progress: {activityState.currentTick}/{activityState.totalTicks}{" "}
            Hours (Real-time update every 5 seconds).
          </small>
          {renderActionButtons()}
        </>
      ) : (
        <small className="text-info">
          Fast Forwarded! Stats applied instantly.
        </small>
      )}
    </Card>
  );
};

const SpecificArea = () => {
  // Destructuring Hooks di tingkat teratas komponen SpecificArea (Correct Hook Placement)
  const {
    moveSpecificLocation,
    currentArea,
    specificLocation,
    gameSpecificAreas,
    startActivity,
    activityState,
    fastForwardActivity,
    playerItems,
  } = useGame();

  const specificAreaKey = `${currentArea}Area`; // e.g., 'BeachArea'
  const areaData = gameSpecificAreas[specificAreaKey] || {};
  const locations = areaData.locations || {};

  let positions = {};

  if (currentArea === "Beach") {
    positions = {
      "Sands Area": { top: "30%", left: "20%" },
      "Road (for going back)": { top: "50%", left: "45%" },
      "Shop Area": { top: "70%", left: "25%" },
      Hotel: { top: "30%", left: "75%" },
      "Sea Area": { top: "70%", left: "70%" },
      Exit: { top: "50%", left: "45%" },
    };
  } else if (currentArea === "Home") {
    positions = {
      Kitchen: { top: "25%", left: "20%" },
      Bedroom: { top: "55%", left: "40%" },
      Bathroom: { top: "25%", left: "60%" },
      Exit: { top: "80%", left: "50%" },
    };
  } else {
    // Posisi untuk Temple, Lake, Mountain
    const activityLocationName = Object.keys(locations).find(
      (loc) => loc !== "Exit"
    );

    if (activityLocationName) {
      positions[activityLocationName] = { top: "30%", left: "30%" }; // Aktivitas di pojok kiri atas
    }
    positions["Exit"] = { top: "70%", left: "70%" }; // Exit di pojok kanan bawah
  }

  const getAreaStyle = (locationName) => ({
    ...positions[locationName],
    position: "absolute",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    border:
      locationName === specificLocation ? "3px solid blue" : "1px solid black",
    backgroundColor: "#eee",
    padding: "5px",
    textAlign: "center",
    opacity: activityState.name ? 0.5 : 1, // Blur areas when activity is ongoing
    pointerEvents: activityState.name ? "none" : "auto", // Disable clicks during activity
  });

  // Ambil daftar aktivitas untuk lokasi spesifik saat ini
  const currentActivities = locations[specificLocation]?.activities || [];

  // Cek apakah item yang diperlukan tersedia
  const isActivityAvailable = (activityName) => {
    const activityKey = `${specificLocation} - ${activityName}`;
    const definition = activityDefinitions[activityKey];
    if (!definition || !definition.requiredItems) return true;

    return definition.requiredItems.every((itemReq) =>
      playerItems.some((item) => item.id === itemReq && item.inInventory)
    );
  };

  const handleActivityStart = (activityName, mode) => {
    const activityKey = `${specificLocation} - ${activityName}`;
    startActivity(activityKey, mode);
  };

  // Hanya tampilkan lokasi yang sudah didefinisikan posisinya
  const displayedLocations = Object.keys(locations).filter(
    (loc) => positions[loc]
  );

  return (
    <div
      className="d-flex flex-column flex-grow-1 position-relative"
      style={{ height: "500px" }}
    >
      <div style={{ position: "relative", flexGrow: 1 }}>
        {/* Panel Aktivitas Sedang Berlangsung (Hanya muncul jika activityState.name ada) */}
        <ActivityPanel
          activityState={activityState}
          fastForwardActivity={fastForwardActivity}
        />

        {/* Area Lingkaran */}
        {displayedLocations.map((locationName) => (
          <div
            key={locationName}
            style={getAreaStyle(locationName)}
            onClick={() => moveSpecificLocation(locationName)}
            className="shadow-sm cursor-target"
          >
            <span className="text-dark">
              {locationName
                .replace(" (for going back)", "")
                .replace(" Area", "")
                .replace(" Spot", "")
                .replace("head", "")}
            </span>

            {/* Player Icon di lokasi saat ini */}
            {locationName === specificLocation && (
              <div
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "-15px",
                  fontSize: "30px",
                }}
              >
                🧍
              </div>
            )}

            {/* Tombol Aktivitas (Hanya muncul di lokasi spesifik saat ini) */}
            {locationName === specificLocation &&
              currentActivities.length > 0 &&
              !specificLocation.includes("Exit") && (
                <Card
                  className="position-absolute p-2 shadow"
                  style={{
                    bottom: "10px",
                    right: "10px",
                    width: "250px",
                    zIndex: 10,
                    opacity: activityState.name ? 0.5 : 1, // Blur buttons when activity is ongoing
                    pointerEvents: activityState.name ? "none" : "auto", // Disable clicks during activity
                  }}
                >
                  <h6>Activities in {locationName}:</h6>
                  {currentActivities.map((activityName) => {
                    const activityKey = `${specificLocation} - ${activityName}`;
                    const isAvailable = isActivityAvailable(activityName);
                    const definition = activityDefinitions[activityKey] || {};

                    return (
                      <div
                        key={activityName}
                        className="mb-2 border-bottom pb-1"
                      >
                        <span className="me-2" style={{ fontWeight: "bold" }}>
                          {activityName} {definition.animation}
                        </span>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant={
                              isAvailable ? "outline-dark" : "outline-secondary"
                            }
                            size="sm"
                            className="cursor-target flex-fill me-1"
                            onClick={() =>
                              handleActivityStart(activityName, "normal")
                            }
                            disabled={!isAvailable}
                          >
                            Normal Mode
                          </Button>
                          <Button
                            variant={
                              isAvailable
                                ? "outline-primary"
                                : "outline-secondary"
                            }
                            size="sm"
                            className="cursor-target flex-fill"
                            onClick={() =>
                              handleActivityStart(activityName, "fastforward")
                            }
                            disabled={!isAvailable}
                          >
                            Fast Forward
                          </Button>
                        </div>
                        {!isAvailable &&
                          definition.requiredItems.length > 0 && (
                            <small className="text-danger">
                              {" "}
                              (Needs: {definition.requiredItems.join(", ")})
                            </small>
                          )}
                      </div>
                    );
                  })}
                </Card>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecificArea;
