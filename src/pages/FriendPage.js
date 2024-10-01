import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { debounce } from "lodash";
import { FaTelegramPlane } from "react-icons/fa";
import UserInfo from "../components/UserInfo";
import SkeletonLoader from "../components/skeleton/SkeletonLoader";

import {
  MainContainer,
  UserInfoContainer,
  PointsDisplayContainer,
  InviteIcon3D,
  InviteText,
  ReferralContainer,
  BonusBox,
  BonusContent,
  BonusIcon,
  BonusText,
  CrownText,
  ButtonRow,
  ReferralButton,
  CopyIcon,
  CopySuccessMessage,
  ReferralStatsContainer,
  ReferralStatsHeading,
  NoReferralsMessage,
  ReferralItem,
  ReferralUsername,
  ReferralPoints,
  PointText,
  GemIcon,
} from "../style/FriendPageStyles";

const FriendPage = () => {
  const [userID, setUserID] = useState(null);
  const [points, setPoints] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
      } else {
        console.error("User ID not available from Telegram.");
      }
    };

    getUserID();
  }, []);

  const fetchUserInfo = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/${userID}`
        );
        const userData = response.data;
        setPoints(userData.points);
        setReferralLink(`https://t.me/Gemhuntersclub_bot?start=${userID}`);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }, 1000),
    [userID]
  );

  const fetchReferralStats = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/referrals/stats/${userID}`
        );
        setReferralCount(response.data.referralCount);
        setReferrals(response.data.referrals);
      } catch (error) {
        console.error("Error fetching referral stats:", error);
      } finally {
        setLoading(false); // Stop loading after data fetch
      }
    }, 1000),
    [userID]
  );

  useEffect(() => {
    if (userID) {
      fetchUserInfo();
      fetchReferralStats();
    }
  }, [userID, fetchUserInfo, fetchReferralStats]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopySuccess("Referral link copied!");
        setTimeout(() => setCopySuccess(""), 3000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy.");
        setTimeout(() => setCopySuccess(""), 3000);
      });
  };

  const handleForwardLink = () => {
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=🚀 Tap, Play, and Earn!%0A%0A🚀 Join the Gem Hunters Club and start your journey to becoming crypto-rich!%0A🌟 I'm already a proud club member, and trust me, it's an absolute game-changer!%0A💎 Come and be part of the Gem Hunters Club today!`;
    window.Telegram.WebApp?.openTelegramLink(inviteLink);
  };
  

  return (
    <MainContainer>
      {/* User Info Section */}
      <UserInfoContainer>
        <UserInfo userID={userID} points={points} />
      </UserInfoContainer>

      {/* Invite Friend Section */}
      <PointsDisplayContainer>
        <InviteIcon3D
          src="https://i.postimg.cc/VNBwg5PP/square.png"
          alt="Invite Icon"
        />
        <InviteText>
          You and your friend will receive bonuses for the invitation!
        </InviteText>
      </PointsDisplayContainer>

      {/* Referral Container */}
      <ReferralContainer>
        <BonusBox>
          <BonusContent>
            <BonusIcon
              src="https://i.postimg.cc/tCWXS96k/Invite-Friend-Premium.png"
              alt="Premium Icon"
            />
            <BonusText>
              Invite Premium User
              <CrownText>
                <GemIcon /> <PointText>10000</PointText>
              </CrownText>
            </BonusText>
          </BonusContent>
          {/* <BonusArrow>
            <FaArrowRight />
          </BonusArrow> */}
        </BonusBox>

        <BonusBox>
          <BonusContent>
            <BonusIcon
              src="https://i.postimg.cc/rFFBWcJz/Invite-Friend-Normal.png"
              alt="Crown Icon"
            />
            <BonusText>
              Invite a Friend
              <CrownText>
                <GemIcon /> 2000
              </CrownText>
            </BonusText>
          </BonusContent>
          {/* <BonusArrow>
            <FaArrowRight />
          </BonusArrow> */}
        </BonusBox>

        {/* Buttons for Telegram and Copy Link */}
        <ButtonRow>
          <ReferralButton onClick={handleForwardLink}>
            <FaTelegramPlane />
            Invite Friend
          </ReferralButton>
          <CopyIcon onClick={handleCopyLink} />
        </ButtonRow>
        {copySuccess && <CopySuccessMessage>{copySuccess}</CopySuccessMessage>}
      </ReferralContainer>

      {/* Referral Stats Section */}
      <ReferralStatsContainer>
        <ReferralStatsHeading>Referral Stats</ReferralStatsHeading>

        {/* Show total referrals with loading state */}
        <p>Total Referrals: {loading ? "Loading..." : referralCount}</p>

        {loading ? (
          <SkeletonLoader /> // Display skeleton loader while loading
        ) : referralCount === 0 ? (
          <NoReferralsMessage>You have no referrals yet</NoReferralsMessage>
        ) : (
          <div>
            {referrals.map((referral) => (
              <ReferralItem key={referral.id}>
                <ReferralUsername>{referral.username}</ReferralUsername>
                <ReferralPoints>
                  <GemIcon /> {referral.pointsAwarded}
                </ReferralPoints>
              </ReferralItem>
            ))}
          </div>
        )}
      </ReferralStatsContainer>
    </MainContainer>
  );
};

export default FriendPage;