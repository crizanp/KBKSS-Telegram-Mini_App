import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaTelegramPlane } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
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

// Fetch user info using axios
const fetchUserInfo = async (userID) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/user-info/${userID}`
  );
  return data;
};

// Fetch referral stats using axios
const fetchReferralStats = async (userID) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/referrals/stats/${userID}`
  );
  return data;
};

const FriendPage = () => {
  const [userID, setUserID] = useState(null);
  const [referralLink, setReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    // Fetch userID from Telegram WebApp
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
        setReferralLink(`https://t.me/Gemhuntersclub_bot?start=${tgUserID}`);
      } else {
        console.error("User ID not available from Telegram.");
      }
    };
    getUserID();
  }, []);

  // Use React Query to fetch user info
  const { data: userInfo, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ['userInfo', userID],
    queryFn: () => fetchUserInfo(userID),
    enabled: !!userID, // Only run query if userID is available
  });

  // Use React Query to fetch referral stats
  const { data: referralStats, isLoading: referralsLoading, isError: referralsError } = useQuery({
    queryKey: ['referralStats', userID],
    queryFn: () => fetchReferralStats(userID),
    enabled: !!userID, // Only run query if userID is available
  });

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
        
          <UserInfo userID={userID} points={userInfo?.points || 0} />
       
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

        {/* Handle loading, error, or display referral stats */}
        {referralsLoading ? (
          <SkeletonLoader /> // Show loader for referral stats
        ) : referralsError ? (
          <p>Error fetching referral stats</p> // Show error if stats fail to load
        ) : (
          <>
            <p>Total Referrals: {referralStats?.referralCount || 0}</p>
            {referralStats?.referralCount === 0 ? (
              <NoReferralsMessage>You have no referrals yet</NoReferralsMessage>
            ) : (
              referralStats?.referrals.map((referral) => (
                <ReferralItem key={referral.id}>
                  <ReferralUsername>{referral.username}</ReferralUsername>
                  <ReferralPoints>
                    <GemIcon /> {referral.pointsAwarded}
                  </ReferralPoints>
                </ReferralItem>
              ))
            )}
          </>
        )}
      </ReferralStatsContainer>
    </MainContainer>
  );
};

export default FriendPage;
