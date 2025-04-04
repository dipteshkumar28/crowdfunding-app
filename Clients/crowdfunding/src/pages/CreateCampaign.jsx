import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { money } from "../assets";
import { CustomButtons, Formfield } from '../components';
import { checkIfImage } from "../utils";
import { useStateContext } from '../context';


const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setform] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldname, e) => {
    setform({ ...form, [fieldname]: e.target.value })
  }

  const handlesubmit = (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setisLoading(true)
        await createCampaign({ ...form, target: ethers.parseUnits(form.target, 18) })
        setisLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setform({ ...form, image: '' });
      }
    })
  }

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4'>
      {isLoading && 'Loader...'}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>
      <form onSubmit={handlesubmit} className='w-full mt-[65px] flex flex-col gap-[30px]'>
        <div className='flex flex-wrap gap-[40px]'>
          <Formfield labelName="Your Name *" placeholder="John Doe" inputType="text" value={form.name} handlechange={(e) => handleFormFieldChange('name', e)} />
          <Formfield labelName="Campaign Title" placeholder="Write a title" inputType="text" value={form.title} handlechange={(e) => handleFormFieldChange('title', e)} />
        </div>
        <Formfield labelName="Story" placeholder="Write your story" isTextArea value={form.description} handlechange={(e) => handleFormFieldChange('description', e)} />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>
        <div className='flex flex-wrap gap-[40px]'>
          <Formfield labelName="Goal *" placeholder="ETH 0.50" inputType="text" value={form.target} handlechange={(e) => handleFormFieldChange('target', e)} />
          <Formfield labelName="End Date" placeholder="End Date" inputType="date" value={form.deadline} handlechange={(e) => handleFormFieldChange('deadline', e)} />
        </div>
        <Formfield
          labelName="Campaign image *"
          placeholder="Place Image URL of your campaign"
          inputType="url"
          value={form.image}
          handlechange={(e) => handleFormFieldChange('image', e)}
        />
        <div className="flex justify-center items-center mt-[5px] lg:ml-[30px]">
          <CustomButtons
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>

      </form>
    </div>
  )
}

export default CreateCampaign;
