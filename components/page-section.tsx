function PageSection ({ children, title }: PageSectionProps) {
  return (
    <section className="w-full h-full p-5 relative 2xl:max-w-[1300px] lg:max-w-[1000px] m-auto">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>
      {children}
    </section>
  );
}

export default PageSection;