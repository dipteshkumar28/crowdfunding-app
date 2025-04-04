import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context';
import { DisplayCampaign } from '../components';

const Home = () => {

  const [isloading, setisloading] = useState(false);
  const [campaigns, setcampaigns] = useState([]);

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setisloading(true);
    const data = await getCampaigns();
    setcampaigns(data);
    setisloading(false);
  }
  useEffect(() => {
    if (contract) {
        fetchCampaigns();
    }
  }, [address, contract]);


  return (
    <DisplayCampaign
      title="All Campaigns"
      isLoading={isloading}
      campaigns={campaigns}
    />
  )
}

export default Home;
