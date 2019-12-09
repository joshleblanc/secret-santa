import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SantaIcon from "../components/SantaIcon";
export const drawerWidth = 240;

export const routes = [
  {
    name: "Home",
    href: "/",
    Icon: HomeIcon
  }
];

export const authenticatedRoutes = [
  {
    name: "Secret Santas",
    href: "/groups",
    Icon: SantaIcon
  },
  {
    name: "Profile",
    href: "/profile",
    Icon: AccountBoxIcon
  }
];