import React, { useState } from "react";
import { useGame } from "../context/useGame";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { activityDefinitions } from "../context/GameConstants";

// Komponen untuk menampilkan aktivitas yang sedang berlangsung
const ActivityPanel = ({ activityState, fastForwardActivity }) => {
  // Hanya ambil state dari props, karena semua Hooks sudah dipanggil di SpecificArea
  const { name, progress, message, animation, mode } = activityState;
  const activityName = name?.split(" - ")[1];

  // Ambil FF_FEE dari context
  const { FAST_FORWARD_FEE } = useGame();

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
          Fast Forward (Instant Finish) (Cost: 💰
          {FAST_FORWARD_FEE.toLocaleString("id-ID")})
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

// Komponen Modal Konfirmasi Kustom
const FastForwardConfirmModal = ({
  costDetails,
  onConfirm,
  onCancel,
  activityName,
  activityKey,
  FAST_FORWARD_FEE,
}) => {
  const { baseMoneyCost, totalPayment } = costDetails;

  return (
    <Card
      className="position-absolute p-3 shadow-lg border-primary"
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "350px",
        zIndex: 300, // ZIndex tinggi agar berada di atas overlay
        textAlign: "center",
        borderWidth: "4px",
      }}
    >
      <h5 className="mb-3 text-primary">KONFIRMASI FAST FORWARD</h5>
      <p className="text-dark" style={{ fontWeight: "bold" }}>
        Aktivitas: {activityName.split(" - ")[1]}
      </p>

      <div className="text-start mb-3 border-top pt-2">
        <p className="mb-1">
          Biaya Fast Forward (Tambahan):{" "}
          <strong className="float-end text-danger">
            💰{FAST_FORWARD_FEE.toLocaleString("id-ID")}
          </strong>
        </p>
        {baseMoneyCost < 0 && (
          <p className="mb-1">
            Biaya Aktivitas Dasar:{" "}
            <strong className="float-end text-danger">
              💰{Math.abs(baseMoneyCost).toLocaleString("id-ID")}
            </strong>
          </p>
        )}
        <hr className="my-1" />
        <p className="mb-0 fs-5">
          Total Biaya:{" "}
          <strong className="float-end text-danger fs-5">
            💰{totalPayment.toLocaleString("id-ID")}
          </strong>
        </p>
      </div>

      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          className="cursor-target flex-fill me-2"
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          className="cursor-target flex-fill ms-2"
          onClick={() => onConfirm(activityKey, "fastforward")}
        >
          Konfirmasi & FF!
        </Button>
      </div>
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
    FAST_FORWARD_FEE,
    playerStats,
  } = useGame();

  // State baru untuk mengontrol modal konfirmasi FF
  const [confirmFF, setConfirmFF] = useState(null);

  const specificAreaKey = `${currentArea}Area`; // e.g., 'BeachArea'
  const areaData = gameSpecificAreas[specificAreaKey] || {};
  const locations = areaData.locations || {};

  let positions = {};

  if (currentArea === "Beach") {
    positions = {
      "Sands Area": { top: "30%", left: "20%" },
      Exit: { top: "50%", left: "45%" }, 
      "Shop Area": { top: "70%", left: "25%" },
      Hotel: { top: "30%", left: "75%" },
      "Sea Area": { top: "70%", left: "70%" },
    };
  } else if (currentArea === "Home") {
    positions = {
      Kitchen: { top: "25%", left: "20%" },
      Bedroom: { top: "55%", left: "40%" },
      Bathroom: { top: "25%", left: "60%" },
      Exit: { top: "80%", left: "50%" },
    };
  } else {
    // FIX: Posisi untuk Temple, Lake, Mountain (Area dengan 2 lokasi)
    const activityLocationName = Object.keys(locations).find(
      (loc) => loc !== "Exit"
    );

    if (activityLocationName) {
      // Activity di tengah atas
      positions[activityLocationName] = { top: "30%", left: "45%" };
    }
    positions["Exit"] = { top: "70%", left: "45%" }; // Exit di tengah bawah
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
    opacity: activityState.name || confirmFF ? 0.5 : 1, // Blur areas when activity or modal is ongoing
    pointerEvents: activityState.name || confirmFF ? "none" : "auto", // Disable clicks when activity or modal is ongoing
  });

  // Ambil daftar aktivitas untuk lokasi spesifik saat ini
  const currentActivities = locations[specificLocation]?.activities || [];

  // Cek apakah item yang diperlukan tersedia
  const isActivityAvailable = (activityName) => {
    const activityKey = `${specificLocation} - ${activityName}`;
    const definition = activityDefinitions[activityKey];
    // Pastikan requiredItems diakses dengan aman
    if (!definition || !definition.requiredItems?.length) return true;

    return definition.requiredItems.every((itemReq) =>
      playerItems.some((item) => item.id === itemReq && item.inInventory)
    );
  };

  // Cek apakah ada uang yang cukup untuk Fast Forward
  const isFastForwardAffordable = () => playerStats.money >= FAST_FORWARD_FEE;

  // Cek apakah ada uang yang cukup untuk biaya dasar aktivitas
  const isBaseCostAffordable = (activityKey) => {
    // FIX: Menggunakan optional chaining (?.) untuk mengakses properti bersarang
    const definition = activityDefinitions[activityKey];
    const baseMoneyCost = definition?.statChanges?.money || 0;
    // Perhatikan: baseMoneyCost negatif (biaya)
    return playerStats.money + baseMoneyCost >= 0;
  };

  // Logic konfirmasi dan memulai aktivitas
  const handleConfirmFF = (activityKey, mode) => {
    setConfirmFF(null); // Tutup modal
    // Lanjutkan ke fungsi startActivity di GameContext
    startActivity(activityKey, mode);
  };

  const handleCancelFF = () => {
    setConfirmFF(null); // Tutup modal
  };

  const handleActivityStart = (activityName, mode) => {
    const activityKey = `${specificLocation} - ${activityName}`;
    // FIX: Menggunakan optional chaining (?.) untuk mengakses properti bersarang
    const definition = activityDefinitions[activityKey];
    const baseMoneyCost = definition?.statChanges?.money || 0;

    if (mode === "fastforward") {
      // Hitung total biaya yang dikeluarkan (absolute value)
      const totalCost = Math.abs(baseMoneyCost) + FAST_FORWARD_FEE;
      if (playerStats.money < totalCost) {
        alert(
          `Uang tidak cukup! Total biaya Fast Forward adalah 💰${totalCost.toLocaleString(
            "id-ID"
          )}.`
        );
        return;
      }

      // Tampilkan modal konfirmasi kustom
      setConfirmFF({
        activityKey,
        activityName: `${specificLocation} - ${activityName}`,
        costDetails: { baseMoneyCost, totalPayment: totalCost },
      });
      return; // Stop di sini, tunggu konfirmasi modal
    }

    // Lanjutkan dengan memulai aktivitas jika mode normal
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
      <div className="text-center py-2 bg-light border-top border-dark">
        <small>
          Specific Area Stage ({currentArea} -{" "}
          {specificLocation || "No Location"})
        </small>
      </div>
      <div style={{ position: "relative", flexGrow: 1 }}>
        {/* Overlay for confirmation modal */}
        {confirmFF && (
          <div
            style={{
              position: "relative",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 250,
            }}
          />
        )}

        {/* Confirmation Modal */}
        {confirmFF && (
          <FastForwardConfirmModal
            costDetails={confirmFF.costDetails}
            activityName={confirmFF.activityName}
            activityKey={confirmFF.activityKey}
            FAST_FORWARD_FEE={FAST_FORWARD_FEE}
            onConfirm={handleConfirmFF}
            onCancel={handleCancelFF}
          />
        )}

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
              !locationName.includes("Exit") && (
                <Card
                  className="position-absolute p-2 shadow"
                  style={{
                    bottom: "10px",
                    right: "10px",
                    width: "250px",
                    zIndex: 10,
                    opacity: activityState.name || confirmFF ? 0.5 : 1, // Blur buttons when activity or modal is ongoing
                    pointerEvents:
                      activityState.name || confirmFF ? "none" : "auto", // Disable clicks when activity or modal is ongoing
                  }}
                >
                  <h6>Activities in {locationName}:</h6>
                  {currentActivities.map((activityName) => {
                    const activityKey = `${specificLocation} - ${activityName}`;
                    const isAvailable =
                      isActivityAvailable(activityName) &&
                      isBaseCostAffordable(activityKey);
                    const isFastForwardPossible =
                      isAvailable && isFastForwardAffordable();
                    const definition = activityDefinitions[activityKey] || {};
                    const moneyText = definition.statChanges?.money // Safe access
                      ? ` (Cost: 💰${Math.abs(
                          definition.statChanges.money
                        ).toLocaleString("id-ID")})`
                      : "";

                    return (
                      <div
                        key={activityName}
                        className="mb-2 border-bottom pb-1"
                      >
                        <span className="me-2" style={{ fontWeight: "bold" }}>
                          {activityName} {definition.animation}
                          {moneyText}
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
                              isFastForwardPossible
                                ? "outline-primary"
                                : "outline-secondary"
                            }
                            size="sm"
                            className="cursor-target flex-fill"
                            onClick={() =>
                              handleActivityStart(activityName, "fastforward")
                            }
                            disabled={!isFastForwardPossible}
                            title={
                              !isFastForwardPossible && isAvailable
                                ? `Needs 💰${FAST_FORWARD_FEE.toLocaleString(
                                    "id-ID"
                                  )} for Fast Forward Fee`
                                : ""
                            }
                          >
                            FF (💰{FAST_FORWARD_FEE.toLocaleString("id-ID")})
                          </Button>
                        </div>
                        {!isAvailable &&
                          (definition.requiredItems?.length > 0 || // Safe access
                            !isBaseCostAffordable(activityKey)) && (
                            <small className="text-danger">
                              (
                              {definition.requiredItems?.length > 0
                                ? `Needs: ${definition.requiredItems.join(
                                    ", "
                                  )}`
                                : ""}
                              {!isBaseCostAffordable(activityKey)
                                ? " Not enough money for base cost!"
                                : ""}
                              )
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
