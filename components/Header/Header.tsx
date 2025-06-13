import Image from "next/image";

const Header = () => (
  <header className="flex items-center justify-center p-4">
    <Image src="/logos/moneybox.svg" alt="Moneybox" width={240} height={40} />
  </header>
);

export default Header;