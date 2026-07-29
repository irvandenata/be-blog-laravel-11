import callAPI from "../utils/callApi";
import { API_VERSION, ROOT_API } from "@/constants/api";
import { ISeoSetting } from "@/interfaces/seoSetting";

export async function fetchSeoSettings(): Promise<{ data: ISeoSetting }> {
  return await callAPI({
    url: `${ROOT_API}/${API_VERSION}/settings/seo`,
    method: "GET",
    token: true,
  });
}

export async function updateSeoSettings(
  data: ISeoSetting,
): Promise<{ data: ISeoSetting }> {
  return await callAPI({
    url: `${ROOT_API}/${API_VERSION}/settings/seo`,
    method: "POST",
    data,
    token: true,
  });
}
