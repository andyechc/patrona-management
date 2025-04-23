function PageSection({ children, title }: PageSectionProps) {
  return (
    <section className="w-full h-screen p-5 relative 2xl:max-w-[1300px] lg:max-w-[1000px] m-auto">
      <h2 className="z-30 text-2xl font-bold mb-5 px-2 py-4 sticky top-0 left-0 bg-background border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default PageSection;
