import { useEffect, useState, useMemo } from "react";
import {
	useMoralisQuery,
	useMoralisCloudFunction,
	useMoralis,
} from "react-moralis";
import { useWindowSize } from "../hooks/useWindowSize";
import useBoardWidth from "../hooks/useBoardWidth";

import TabView from "./views/TabView";
import MobileView from "./views/MobileView";
import DesktopView from "./views/DesktopView";

import "../styles/game.scss";
import LiveBoard from "./ChessBoards/Live";

const LiveChess = ({ pairingParams, isPairing, setIsPairing }) => {
	const [gameId, setGameId] = useState();
	const [playerSide, setPlayerSide] = useState("white");

	const [isMobileDrawerVisible, setIsMobileDrawerVisible] = useState(false);

	const { user, isInitialized } = useMoralis();

	const {
		fetch: joinLiveChess,
		data: challenge,
		// error: challengeError,
		isLoading: joiningLiveChess,
	} = useMoralisCloudFunction(
		"joinLiveChess",
		{
			gamePreferences: pairingParams,
		},
		{
			autoFetch: false,
		}
	);
	const { fetch: doesActiveChallengeExist, data: isLiveChallenge } =
		useMoralisCloudFunction("doesActiveChallengeExist", {});

	const {
		data: [liveGameData],
		error: gameError,
		isLoading: isGameLoading,
	} = useMoralisQuery(
		"Game",
		(query) => query.equalTo("challengeId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);
	const {
		data: [liveChallengeData],
		// error: gameError,
		isLoading: isChallengeLoading,
	} = useMoralisQuery(
		"Challenge",
		(query) => query.equalTo("objectId", challenge?.id),
		[challenge],
		{
			autoFetch: true,
			live: true,
		}
	);

	useEffect(() => {
		doesActiveChallengeExist();
	}, []);

	useEffect(() => {
		if (isPairing || isLiveChallenge) {
			setIsPairing(false);
			joinLiveChess();
		}
	}, [isPairing, isLiveChallenge]);

	useEffect(() => {
		if (challenge) setGameId(challenge?.get("gameId"));
	}, [challenge]);

	const liveGameAttributes = useMemo(
		() => liveGameData?.attributes,
		[liveGameData]
	);

	const isPlayerWhite = useMemo(() => {
		return liveGameData
			? liveGameData.get("sides")[user?.get("ethAddress")] === "w"
			: "w";
	}, [liveGameData, user]);

	const winSize = useWindowSize();
	const boardWidth = useBoardWidth();

	if (winSize.width < 700)
		return (
			<MobileView
				isMobileDrawerVisible={isMobileDrawerVisible}
				setIsMobileDrawerVisible={setIsMobileDrawerVisible}
				isPlayerWhite={isPlayerWhite}
				winSize={winSize}>
				<LiveBoard
					liveGameAttributes={liveGameAttributes}
					user={user}
					isPlayerWhite={isPlayerWhite}
					playerSide={isPlayerWhite ? "w" : "b"}
					boardWidth={boardWidth}
				/>
			</MobileView>
		);
	else if (winSize.width >= 700 && winSize.width < 1024)
		return (
			<TabView isPlayerWhite={isPlayerWhite} winSize={winSize}>
				<LiveBoard
					liveGameAttributes={liveGameAttributes}
					user={user}
					isPlayerWhite={isPlayerWhite}
					boardWidth={boardWidth}
				/>
			</TabView>
		);
	else
		return (
			<DesktopView
				joinLiveChess={joinLiveChess}
				isPlayerWhite={isPlayerWhite}
				winSize={winSize}>
				<LiveBoard
					liveGameAttributes={liveGameAttributes}
					user={user}
					isPlayerWhite={isPlayerWhite}
					boardWidth={boardWidth}
				/>
			</DesktopView>
		);
};

export default LiveChess;
