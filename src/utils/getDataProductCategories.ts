"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function getDataProductCategories() {
  const payload = await getPayload({ config: await configPromise });

  const result = await payload.find({
    collection: "productCategories",
    sort: "-createdAt",
    pagination: false, 
  });

  return result.docs;
}
