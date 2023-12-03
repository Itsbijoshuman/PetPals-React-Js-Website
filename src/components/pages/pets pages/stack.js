import React, { useState, Children, useEffect } from "react";
import styled from "@emotion/styled";
import { Card } from "./Card";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase-config";

// basic default styles for container
const Frame = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const Stack = ({ onVote, children, ...props }) => {
  const [stack, setStack] = useState(Children.toArray(children));

  // return new array with last item removed
  const pop = (array) => {
    return array.filter((_, index) => {
      return index < array.length - 1;
    });
  };

  const handleVote = (item, vote) => {
    // update the stack
    let newStack = pop(stack);
    setStack(newStack);

    // run function from onVote prop, passing the current item and value of vote
    onVote(item, vote);

    if (vote === true) {
      handleFav(item);
    } else {
      console.log("rejected");
    }
  };
  const getUserData = async function (user) {
    const UserDoc = doc(db, "users", user);
    const DocSnap = await getDoc(UserDoc);
    return DocSnap.data();
  };

  const handleFav = async function (item) {
    const currentUserData = await getUserData(auth.currentUser.uid);
    const petUserData = await getUserData(item.props["data-value"]);
    const petUser = item.props["data-value"];

    // adding the pet into the favourites array of the user
    if (currentUserData.favArr.includes(petUser)) {
      if (currentUserData.petArr.includes(item.key.slice(2))) {
        console.log("included");
        return;
      } else {
        const updateFile = doc(db, "users", auth.currentUser.uid);
        await updateDoc(updateFile, {
          petArr: [...currentUserData.petArr, item.key.slice(2)],
        });
      }
    } else {
      const updateFile = doc(db, "users", auth.currentUser.uid);
      await updateDoc(updateFile, {
        favArr: [...currentUserData.favArr, petUser],
        petArr: [item.key.slice(2), ...currentUserData.petArr],
      });
    }

    // NEED TO ADD LIKED PETS ARRAY FOR USAGE
    // adding the user who liked the pet into the favourites array of the pet user
    if (petUserData.favArr.includes(currentUserData.uid)) {
      console.log(
        "the vote is true",
        item.props["data-value"],
        item.key.slice(2)
      );
    } else {
      const updatePetUserfavArr = doc(db, "users", petUser);
      await updateDoc(updatePetUserfavArr, {
        favArr: [...petUserData.favArr, currentUserData.uid],
      });
    }
  };

  return (
    <>
      <Frame {...props}>
        {stack.map((item, index) => {
          let isTop = index === stack.length - 1;
          return (
            <Card
              drag={isTop} // Only top card is draggable
              key={item.key || index}
              onVote={(result) => handleVote(item, result)}
            >
              {item}
            </Card>
          );
        })}
      </Frame>
    </>
  );
};