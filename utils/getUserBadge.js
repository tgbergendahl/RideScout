// utils/getUserBadge.js
import rsBadge from '../assets/RS.png';
import silverCheckmark from '../assets/silver_checkmark.png';
import goldCheckmark from '../assets/gold_checkmark.png';

export const getUserBadge = (user) => {
  if (user.isCertifiedDealer) {
    return goldCheckmark;
  } else if (user.isCertifiedSeller) {
    return silverCheckmark;
  } else {
    return rsBadge;
  }
};
