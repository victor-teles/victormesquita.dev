import { type FC } from "react";
import DrizzleLogo from "../DrizzleLogo";
import PrismaIcon from "../PrismaIcon";

interface Props {
  logo: string;
}

const Logo: FC<Props> = ({ logo }) => {
  if (logo === "drizzle") {
    return <DrizzleLogo />;
  }
  if (logo === "prisma") {
    return <PrismaIcon />;
  }
  return null;
};

export default Logo;
