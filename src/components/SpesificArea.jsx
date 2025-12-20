import React, { useState } from "react";
import { useGame } from "../context/useGame";
import { Button, Card, ProgressBar } from "react-bootstrap";
import { activityDefinitions } from "../context/GameConstants";
// Import modal baru
import ActivitySelectionModal from "./ActivitySelectionModal";

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
          className="mt-3 cursor-target w-100" // w-100 agar tombol penuh
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
        width: "90%", // Gunakan persentase untuk responsif
        maxWidth: "300px", // Batasi lebar maksimum
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
        width: "90%", // Gunakan persentase untuk responsif
        maxWidth: "350px", // Batasi lebar maksimum
        zIndex: 300,
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

      <div className="d-flex justify-content-between flex-column flex-sm-row">
        {" "}
        {/* Flex responsif untuk tombol */}
        <Button
          variant="secondary"
          className="cursor-target flex-fill me-sm-2 mb-2 mb-sm-0" // mb-2 di HP
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button
          variant="primary"
          className="cursor-target flex-fill ms-sm-2"
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
    worldAreas,
    startActivity,
    activityState,
    fastForwardActivity,
    playerItems,
    FAST_FORWARD_FEE,
    playerStats,
    collectItem,
  } = useGame();

  // State baru untuk mengontrol modal konfirmasi FF
  const [confirmFF, setConfirmFF] = useState(null);

  // State baru untuk mengontrol modal pemilihan aktivitas
  const [showActivityModal, setShowActivityModal] = useState(false); // <-- BARU

  const specificAreaKey = `${currentArea}Area`; // e.g., 'BeachArea'
  const areaData = worldAreas[specificAreaKey] || {};
  const locations = areaData.locations || {};

  let positions = {};

  if (currentArea === "Island") {
    positions = {
      Beach: { top: "25%", left: "35%" },
      Jungle: { top: "25%", left: "75%" },
      Exit: { top: "60%", left: "45%" },
    };
  } else if (currentArea === "Castle") {
    positions = {
      Town: { top: "25%", left: "20%" },
      Supermarket: { top: "25%", left: "45%" },
      ThroneRoom: { top: "25%", left: "80%" },
      Exit: { top: "60%", left: "45%" },
    };
  } else if (currentArea === "Cave") {
    positions = {
      Tunnel: { top: "30%", left: "45%" },
      Exit: { top: "60%", left: "45%" },
    };
  } else if (currentArea === "Mercusuar") {
    positions = {
      Refuel: { top: "30%", left: "25%" },
      Top: { top: "30%", left: "70%" },
      Exit: { top: "60%", left: "45%" },
    };
  } else {
    // Fallback otomatis (aman jika nanti nambah area baru)
    const activityLocationName = Object.keys(locations).find(
      (loc) => loc !== "Exit"
    );

    if (activityLocationName) {
      positions[activityLocationName] = { top: "30%", left: "45%" };
    }
    positions["Exit"] = { top: "60%", left: "45%" };
  }

  const getAreaStyle = (locationName) => ({
    ...positions[locationName],
    position: "absolute",
    width: "40px",
    height: "40px",
    backgroundImage: "url(pin.png)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    cursor: "pointer",
    transform: locationName === specificLocation ? "scale(1.2)" : "scale(1)",
    transition: "transform 0.2s ease",
    opacity: activityState.name || confirmFF || showActivityModal ? 0.5 : 1,
    pointerEvents:
      activityState.name || confirmFF || showActivityModal ? "none" : "auto",
  });

  // Ambil daftar aktivitas untuk lokasi spesifik saat ini
  const currentActivities = locations[specificLocation]?.activities || [];

  // Logic untuk membuka modal aktivitas saat lokasi berpindah
  const moveAndShowActivity = (locationName) => {
    // Panggil fungsi pindah lokasi
    moveSpecificLocation(locationName);

    // Jika lokasi yang dituju BUKAN Exit dan memiliki aktivitas, tampilkan modal.
    if (
      !locationName.includes("Exit") &&
      locations[locationName]?.activities?.length > 0
    ) {
      setShowActivityModal(true);
    } else {
      setShowActivityModal(false);
    }
  };

  // --- HAPUS: isActivityAvailable dan isBaseCostAffordable dari sini ---
  // Logika pengecekan ketersediaan sekarang ditangani di ActivitySelectionModal

  // Logic konfirmasi dan memulai aktivitas
  const handleConfirmFF = (activityKey, mode) => {
    setConfirmFF(null); // Tutup modal konfirmasi FF
    // Lanjutkan ke fungsi startActivity di GameContext
    startActivity(activityKey, mode);
  };

  const handleCancelFF = () => {
    setConfirmFF(null); // Tutup modal konfirmasi FF
  };

  const handleActivityStart = (fullActivityKey, mode) => {
    // fullActivityKey is now correctly "Tunnel - EXPLORE CAVE"
    const definition = activityDefinitions[fullActivityKey];
    const baseMoneyCost = definition?.statChanges?.money || 0;

    setShowActivityModal(false);

    if (mode === "fastforward") {
      const totalCost = Math.abs(baseMoneyCost) + FAST_FORWARD_FEE;
      if (playerStats.money < totalCost) {
        alert(`Uang tidak cukup!`);
        return;
      }

      setConfirmFF({
        activityKey: fullActivityKey,
        activityName: fullActivityKey,
        costDetails: { baseMoneyCost, totalPayment: totalCost },
      });
      return;
    }

    startActivity(fullActivityKey, mode);
  };

  // Hanya tampilkan lokasi yang sudah didefinisikan posisinya
  const displayedLocations = Object.keys(locations).filter(
    (loc) => positions[loc]
  );

  const getBackgroundImage = () => {
    if (!specificLocation) return "";

    if (currentArea === "Island") {
      if (specificLocation === "Beach") return "beach.jpg";
      if (specificLocation === "Jungle") return "mount.jpg";
    }

    if (currentArea === "Castle") {
      if (specificLocation === "Town") return "town.jpg";
      if (specificLocation === "ThroneRoom") return "throne-room.jpg";
    }

    if (currentArea === "Cave") {
      return "inside-cave.jpg";
    }

    if (currentArea === "Mercusuar") {
      return "inside-mercusuar.jpg";
    }

    return "map.jpg";
  };

  return (
    <div
      className="d-flex flex-column flex-grow-1 position-relative"
      style={{ height: "100%" }}
    >
      <div className="text-center py-2 bg-light border-top border-dark">
        <small>
          Specific Area Stage ({currentArea} -{" "}
          {specificLocation || "No Location"})
        </small>
      </div>
      <div
        style={{
          position: "relative",
          flexGrow: 1,
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.4s ease-in-out",
        }}
      >
        {/* Activity Selection Modal (BARU) */}
        <ActivitySelectionModal
          show={showActivityModal}
          handleClose={() => setShowActivityModal(false)}
          specificLocation={specificLocation}
          currentActivities={currentActivities}
          handleActivityStart={handleActivityStart}
        />

        {/* Overlay for confirmation modal */}
        {confirmFF && (
          <div
            style={{
              position: "absolute",
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

        {/* Panel Aktivitas Sedang Berlangsung */}
        <ActivityPanel
          activityState={activityState}
          fastForwardActivity={fastForwardActivity}
        />

        {/* Area Lingkaran */}
        {displayedLocations.map((locationName) => (
          <div
            key={locationName}
            style={getAreaStyle(locationName)}
            // Ganti onClick untuk memanggil fungsi baru yang membuka modal
            onClick={() => moveAndShowActivity(locationName)}
            className="shadow-sm cursor-target"
          >
            <span
              style={{
                position: "absolute",
                top: "42px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "2px 6px",
                fontSize: "11px",
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
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
                  top: "-25px",
                  left: "-10px",
                  fontSize: "26px",
                }}
              >
                🏴‍☠️
              </div>
            )}
          </div>
        ))}

        {/* COLLECTIBLE ITEM DISPLAY */}
        {locations[specificLocation]?.items?.map((itemId) => {
          const item = playerItems.find((i) => i.id === itemId);

          return (
            <Card
              key={itemId}
              className="position-absolute p-2 shadow"
              style={{
                bottom: "20px",
                left: "150px",
                width: "150px",
                zIndex: 11,
              }}
              onClick={() => collectItem(itemId)}
            >
              <div className="text-center" style={{ fontSize: "2rem" }}>
                {item.icon}
              </div>
              <p className="text-center small">{item.name}</p>
              <Button
                variant="success"
                size="sm"
                className="w-100 cursor-target"
              >
                Collect
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SpecificArea;
