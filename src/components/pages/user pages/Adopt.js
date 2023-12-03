import React from 'react';
import style from './adopt.module.css';
import { db, auth } from "../../../firebase-config";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, useParams } from 'react-router-dom';
import emailjs from 'emailjs-com';

function Adopt() {
  let params = useParams();
  const navigate = useNavigate();

  const sendConsent = async function (user, petId) {
    const petDoc = doc(db, "pets", petId);
    const petDocSnap = await getDoc(petDoc);
    const petData = petDocSnap.data();

    // Get the pet owner's user_uid from the petData
    const ownerUid = petData.user_uid;

    // Get the owner's email from the users collection using the ownerUid
    const userDocRef = doc(db, "users", ownerUid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const ownerEmail = userData.email;

      // Update the pet's interested array
      await updateDoc(petDoc, {
        interested: [...petData.interested, user],
      });

      // Send email notification
      const templateParams = {
        to_email: ownerEmail, // Use the obtained owner's email address
        pet_name: petData.name,
      };

      // Send email using EmailJS service
      emailjs.send('service_i3tx05q', 'template_9dnham8', templateParams, 'TsDYXrlUMTaJefNFh')
        .then((response) => {
          console.log('Email sent:', response);
        })
        .catch((error) => {
          console.error('Email failed to send:', error);
        });

      // Show successful alert and navigate back to profile page
      alert('Interest sent successfully!');
      navigate(`/user/${auth.currentUser.uid}`);
    } else {
      console.log("Owner's user document not found.");
      // Handle the case where owner's user document is not found
    }
      // Show successful alert and navigate back to profile page
      alert('Interest sent successfully!');
      navigate(`/user/${auth.currentUser.uid}`);
    };
  return (
    <div className={style.container} >
        <h1>Adoption Guide</h1>
        
        <h2>Being Prepared</h2>

        <p>Before getting a pet it’s important to consider what is involved in being a responsible owner and to decide whether you’ll be able to meet all your pet’s needs throughout their lifetime. Pets are wonderful companions but owning one is a long-term commitment, so make sure you are ready. </p>

        <h2>Adopting:</h2>
<div>
    <h3>Dog - Things to Consider:</h3>
    <ul>
        <li>Do I want a puppy or an adult dog?</li>
        <li>Can I cover all the financial costs of owning a dog, including food, bedding, toys, and veterinary check-ups, as well as emergency treatments?</li>
        <li>Is my home safe, secure, and suitable for a dog?</li>
        <li>Do I have time to train and socialize a dog?</li>
        <li>Will I be able to provide them with enough company so they don’t get lonely or bored? A dog that receives enough attention is more likely to be well-behaved and social.</li>
        <li>Do I have time to walk and play with a dog every day?</li>
        <li>Am I ready to make a long-term commitment?</li>
    </ul>

    <p>Your local animal welfare organizations or veterinarians can provide you with more information on raising a well-behaved dog and caring for it throughout its lifetime. If you're considering welcoming a new dog into your life, carefully consider what type of dog will suit your lifestyle and family.</p>

    <h3>Caring for your dog:</h3>
    <p>Introducing your new dog to your home, friends, and family is an exciting time. Before you bring your new pet home, make sure you are prepared to provide the best care for your new four-legged friend.</p>
    <ul>
        <li>Is my home clean, comfortable, safe, and secure for my dog?</li>
        <li>Do I have dog food, bedding, toys, and walking equipment ready?</li>
        <li>Have I researched places for dog training and socialization?</li>
        <li>Have I identified a nearby veterinary clinic?</li>
        <li>Do I understand the importance of desexing, microchipping, and registration requirements, as well as vaccinations and preventative health care such as worming, flea, and tick prevention?</li>
    </ul>
</div>

<div className={style.cats}>
    <h3>Cat - Things to Consider:</h3>
    <p>Bringing a new cat or kitten home is a wonderful experience. It is crucial to help your new family member feel safe and comfortable in their new surroundings, so the whole family can enjoy this new relationship.</p>
    <p>Although cats are often independent, they require care and affection from their people. It's important to provide a safe environment for them. Cats should ideally be kept indoors to protect them from accidents and predators. For information on how to care for your new cat, refer to reliable sources or consult your local veterinarian.</p>
</div>

<div>
    <em>For more information, please visit the <a href='https://www.bluecross.org.in/adoption-guide'>Blue Cross of India</a> for adopting pets.</em>
</div>


        <button className={style.consent} onClick={() => sendConsent(auth.currentUser.uid, params.id)}>I understand and consent, send my interest to the owner! </button>
        
    </div>

  )
}

export default Adopt