import React from 'react';
import { useGame } from '../context/useGame';
import { Button, Card } from 'react-bootstrap';

const SpecificArea = () => {
    const { moveSpecificLocation, specificLocation, beachAreas, performActivity, moveArea } = useGame();

    // Menentukan posisi berdasarkan Figure 3
    const positions = {
        'Sands Area': { top: '30%', left: '20%' },
        'Road (for going back)': { top: '50%', left: '45%' },
        'Shop Area': { top: '70%', left: '25%' },
        'Hotel': { top: '30%', left: '75%' },
        'Sea Area': { top: '70%', left: '70%' },
    };

    const getAreaStyle = (areaName) => ({
        ...positions[areaName],
        position: 'absolute',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        border: areaName === specificLocation ? '3px solid blue' : '1px solid black',
        backgroundColor: '#eee',
        padding: '5px',
        textAlign: 'center'
    });

    const isNearSandsArea = specificLocation === 'Sands Area'; // Untuk menampilkan tombol aktivitas

    return (
        <div className="d-flex flex-column flex-grow-1 position-relative" style={{ height: '500px' }}>
            <div style={{ position: 'relative', flexGrow: 1, borderBottom: '1px solid black' }}>
                {/* Area Lingkaran */}
                {Object.keys(positions).map((areaName) => (
                    <div
                        key={areaName}
                        style={getAreaStyle(areaName)}
                        onClick={() => {
                            if (areaName === 'Road (for going back)') {
                                moveArea('Home'); // Kembali ke Home/Main Game Arena
                            } else {
                                moveSpecificLocation(areaName);
                            }
                        }}
                        className="shadow-sm"
                    >
                        {areaName === 'Road (for going back)' ? (
                            <span className="text-dark">**Road**<br/>(for going back)</span>
                        ) : (
                            <span className="text-dark">**{areaName}**</span>
                        )}

                        {/* Player Icon di lokasi saat ini */}
                        {areaName === specificLocation && (
                            <div style={{ position: 'absolute', top: '-15px', left: '-15px', fontSize: '30px' }}>
                                🧍
                            </div>
                        )}

                         {/* Tombol Aktivitas (Figure 3 - hanya muncul di Sands Area) */}
                         {areaName === 'Sands Area' && isNearSandsArea && (
                             <Card className="position-absolute p-2 shadow" style={{ bottom: '110px', right: '-150px', width: '150px', zIndex: 10 }}>
                                 {beachAreas['Sands Area'].activities.map((activity) => (
                                     <Button
                                         key={activity}
                                         variant="outline-dark"
                                         size="sm"
                                         className="mb-1"
                                         onClick={() => performActivity(activity)}
                                     >
                                         {activity}
                                     </Button>
                                 ))}
                             </Card>
                         )}
                    </div>
                ))}
                
                {/* Objek tambahan di tengah arena (misal: bola voli, kelapa) */}
                <span style={{ position: 'absolute', top: '40%', left: '60%', fontSize: '30px' }}>🏐</span>
                <span style={{ position: 'absolute', top: '70%', left: '45%', fontSize: '30px' }}>🌰</span>
            </div>

            <div className="text-center py-2 bg-light border-top border-dark">
                <small>Figure 3. Specific Area Stage</small>
            </div>
        </div>
    );
};

export default SpecificArea;