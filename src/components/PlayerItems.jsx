import React from 'react';
import { useGame } from '../context/useGame';
import { ListGroup, Button } from 'react-bootstrap';

const PlayerItems = () => {
    const { playerItems } = useGame();

    return (
        <div className="border border-dark h-100 d-flex flex-column" style={{ width: '200px' }}>
            <div className="p-2 border-bottom border-dark text-center">
                **Player's Items**
            </div>
            <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
                {playerItems.map((item, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-start align-items-center py-1 px-2 border-0">
                        <span className="me-2" role="img" aria-label="item-icon">{item.icon}</span>
                        {item.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <div className="p-2 border-top border-dark d-flex justify-content-center">
                {/* Movement Controls */}
                <div className="d-flex flex-column align-items-center">
                    <Button variant="outline-dark" size="sm" className="mb-1" style={{ borderRadius: '50%' }}>
                        <i className="bi bi-caret-up-fill"></i>
                    </Button>
                    <div className="d-flex">
                        <Button variant="outline-dark" size="sm" className="me-1" style={{ borderRadius: '50%' }}>
                            <i className="bi bi-caret-left-fill"></i>
                        </Button>
                        <Button variant="outline-dark" size="sm" style={{ borderRadius: '50%' }}>
                            <i className="bi bi-caret-right-fill"></i>
                        </Button>
                    </div>
                    <Button variant="outline-dark" size="sm" className="mt-1" style={{ borderRadius: '50%' }}>
                        <i className="bi bi-caret-down-fill"></i>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PlayerItems;