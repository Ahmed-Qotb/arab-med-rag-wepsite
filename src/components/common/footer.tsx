import Link from "next/link";

function Footer() {
  // ? array of nav links
  const navLinks: { href: string; label: string }[] = [
    {
      href: "/rand",
      label: "rand",
    },
    {
      href: "/rand",
      label: "rand",
    },
    {
      href: "/rand",
      label: "rand",
    },
  ];

  return (
    <footer className="bg-neutral-900 py-5 sm:pt-5 sm:pb-7">
      <div className="container flex justify-center sm:items-center sm:gap-5 flex-wrap sm:flex-nowrap">
        {/* socials */}
        <div className="w-[50%] text-center">
          <h3 className="font-extrabold text-white text-xl">روابط التواصل الاجتماعي</h3>
          <ul className="flex justify-center items-center gap-4 py-5">
            {/* linked in */}
            <li>
              <Link
                target="_blank"
                href={`https://www.linkedin.com/in/ahmed-qotb-043850296/`}
              ></Link>
            </li>
            {/* github */}
            <li>
              <Link
                target="_blank"
                href={`https://github.com/Ahmed-Qotb`}
              ></Link>
            </li>
            {/* gmail email to */}
            <li>
              <Link
                target="_blank"
                href={"mailto:ahmedhassan99fg@gmail.com"}
              ></Link>
            </li>
          </ul>
        </div>
        {/* important links */}
        <div className="w-[50%]  text-center">
          <h3 className="font-extrabold text-white text-xl">روابط سريعة</h3>
          <ul className="flex flex-col item">
            {navLinks.map(
              (link: { href: string; label: string }, index: number) => (
                <li key={index}>
                  <Link
                    key={index}
                    href={link.href}
                    className="hover:text-[#FF7517]"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
        {/* logo with description */}
        <div className="w-full ">
          <div className="footer-words flex text-center gap-3">
            <p className="text-center border-b-2 border-t-2 py-4 border-[#b3b3b3]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              error iste odio maxime, eveniet a amet tempore quis, expedita
              harum voluptatem, perferendis nam nisi. Error, facilis. Maxime
              consequatur harum excepturi!
              <br />
              <span className="font-extrabold">شكراً لزيارتك!</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
