import { useMoralis } from "react-moralis";
import { useState, useEffect } from "react";
import { Layout, Skeleton, Row, Col } from "antd";
import {
	FireOutlined,
	InfoCircleOutlined,
	FireFilled,
} from "@ant-design/icons";

import { ReactComponent as Send } from "../../assets/send.svg";
import { ReactComponent as WhiteKing } from "../../assets/chess_svgs/white_king.svg";
import { ReactComponent as WhiteKnight } from "../../assets/chess_svgs/white_knight.svg";
import { ReactComponent as WhiteQueen } from "../../assets/chess_svgs/white_queen.svg";
import { ReactComponent as WhiteBishop } from "../../assets/chess_svgs/white_bishop.svg";
import { ReactComponent as WhiteRook } from "../../assets/chess_svgs/white_rook.svg";
import { ReactComponent as WhitePawn } from "../../assets/chess_svgs/white_pawn.svg";
import { ReactComponent as BlackKing } from "../../assets/chess_svgs/black_king.svg";
import { ReactComponent as BlackKnight } from "../../assets/chess_svgs/black_knight.svg";
import { ReactComponent as BlackQueen } from "../../assets/chess_svgs/black_queen.svg";
import { ReactComponent as BlackBishop } from "../../assets/chess_svgs/black_bishop.svg";
import { ReactComponent as BlackRook } from "../../assets/chess_svgs/black_rook.svg";
import { ReactComponent as BlackPawn } from "../../assets/chess_svgs/black_pawn.svg";

import { ReactComponent as Abort } from "../../assets/abort.svg";
import { ReactComponent as Draw } from "../../assets/draw.svg";
import { ReactComponent as Win } from "../../assets/win.svg";

const DesktopView = ({
	opSide,
	joinLiveChess,
	children,
	winSize,
	liveGameAttributes,
	isGameLoading,
	gameHistory,
}) => {
	const [wPng, setWPng] = useState([]);
	const [bPng, setBPng] = useState([]);
	// const [movePairCount, setMovePairCount] = useState(1);
	const { user } = useMoralis();

	const styles = {
		Sider: {
			margin: "0",
			padding: "1.5rem",
			borderRadius: "1rem",
			width: "100%",
			zIndex: "1",
		},
	};
	const { Sider, Content } = Layout;

	useEffect(() => {
		if (gameHistory.length <= 0) return;
		if (gameHistory[gameHistory.length - 1].color === "w") {
			setWPng(...wPng, gameHistory[gameHistory.length - 1].san);
		} else {
			setBPng(...bPng, gameHistory[gameHistory.length - 1].san);
		}
	}, [gameHistory]);

	return (
		<Layout className="game-desktop">
			<Sider
				className="chat-room"
				style={styles.Sider}
				collapsible={true}
				collapsedWidth={0}
				trigger={<FireOutlined size={40} />}
				zeroWidthTriggerStyle={{
					backgroundColor: "rgb(255, 64, 64) ",
					borderRadius: "50%",
					width: "3rem",
					height: "3rem",
					top: "5%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					right: "-1.5rem",
				}}
				width={winSize.width * 0.23}>
				<div className="prize-pool">
					<span className="label">Prize Pool</span>
					<div className="prize">
						<span className="ghd">GHD</span>
						<span className="amount">19</span>
					</div>
				</div>
				<div className="chat">
					<div className="chat-text"></div>
					<div className="chat-input">
						<input type="text" />
						<button>
							<Send />
						</button>
					</div>
				</div>
				<div className="btns">
					<button>
						<Win />
						<span className="text">Claim Win</span>
					</button>
					<button>
						<Draw />
						<span className="text" style={{ marginTop: "-0.4rem" }}>
							Draw
						</span>
					</button>
					<button className="danger">
						<Abort />
						<span className="text">Abort</span>
					</button>
				</div>
			</Sider>

			<Content className="chessboard">
				<div id="gameBoard">{children}</div>
			</Content>

			<Sider
				className="game-info"
				style={styles.Sider}
				width={winSize.width * 0.23}>
				{isGameLoading ? (
					<div className="players op">
						<div className="player-info">
							<div className="username">
								{liveGameAttributes?.players[opSide]}
							</div>
							<div className="elo">({liveGameAttributes?.ELO[opSide]})</div>
						</div>
						<div className="fallen-peice fallen-peice-op">
							<WhiteRook size={15} />
							<WhiteKnight size={15} />
							<WhiteBishop size={15} />
						</div>
					</div>
				) : (
					<Skeleton active />
				)}

				<div className="pgn">
					{bPng.map((bMove, idx) => (
						<Row key={idx}>
							<Col flex={1}>{idx + 1}</Col>
							<Col flex={2}>{wPng.length !== 0 ? wPng[idx] : ""}</Col>
							<Col flex={2}>{bMove}</Col>
						</Row>
					))}
				</div>
				<div className="players self">
					<div className="player-info">
						<div className="username">{user?.get("ethAddress")}</div>
						<div className="elo">({user?.get("ELO")})</div>
					</div>
					<div className="fallen-peice fallen-peice-self">
						<BlackPawn size={15} />
						<BlackQueen size={15} />
						<BlackKing size={15} />
					</div>
				</div>
			</Sider>
		</Layout>
	);
};

export default DesktopView;
