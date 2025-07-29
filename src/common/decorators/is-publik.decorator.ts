import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata("isPublic", true);

//agar controller ni ustida guard yozilsa u publik boladi va ularning ichidan qaysi biriga guard shart emas bolsa shu guard ishlatiladi
