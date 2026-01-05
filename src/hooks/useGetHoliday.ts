import axios from "axios";

export const useGetHoliday = async () => {
  const result = await axios.get(
    `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo`,
    {
      params: {
        serviceKey:
          "8d67e5b2bbe18651c2be0a7f5d827030c6170eb37783ed8a8314fcf39a8046a7", // URL Decode 키
        solYear: 2025,
        numOfRows: 100,
        pageNo: 1,
        _type: "json",
      },
    }
  );

  return result;
};
