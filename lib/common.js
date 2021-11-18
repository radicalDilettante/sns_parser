import axios from "axios";

export const convertDate = (date) => {
  const event = new Date(date);
  return event.toISOString();
};
export const getDate = async (url) => {
  const res = await axios.get(url);
  const date = res.headers["last-modified"];
  const IsoString = convertDate(date);
  return IsoString;
};
