export default function Description() {
  return (
    <div className='px-5'>
      <div className='flex w-full flex-col items-center justify-center gap-20 rounded-md py-16 border-y-4 border-y-contrast text-text'>
        <div className='flex flex-col items-center justify-center gap-10 lg:flex-row'>
          <div className='flex w-full lg:w-1/2 flex-col items-center p-8 border-2 border-contrast rounded-xl justify-center gap-10 text-3xl'>
            <span className='text-contrast'>IMAGITOR</span>
            <p className='text-sm'>
              Imagitor is an intuitive and versatile online web image editor
              that empowers users to effortlessly enhance and transform their
              images. With an array of powerful editing tools and effects,
              Imagitor allows you to adjust brightness, contrast, and
              saturation, apply filters, crop and resize images, and add text
              and overlays. Whether you're a professional photographer or a
              casual user, Imagitor offers a seamless editing experience with
              its user-friendly interface and real-time preview feature. From
              retouching portraits to creating stunning visual content, Imagitor
              is your go-to solution for all your image editing needs.
            </p>
            <button className='w-full self-center rounded-xl bg-contrast p-2 text-xl text-text'>
              Try It Yourself
            </button>
          </div>
          <div className='flex h-[50vh] w-full lg:w-1/2 items-center justify-center rounded-xl bg-gray-600'>
            <span>Imagitor preview</span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-10 lg:flex-row-reverse'>
          <div className='flex w-full lg:w-1/2 flex-col items-center p-8 border-2 border-contrast rounded-xl  justify-center gap-4 text-3xl'>
            <span className='text-contrast'>VideoEditor</span>
            <p className='text-sm'>
              VideoEditor is a cutting-edge online tool designed to
              revolutionize your video editing experience. With its sleek and
              user-friendly interface, VideoEditor empowers users to
              effortlessly create professional-quality videos with just a few
              clicks. Whether you're a beginner or a seasoned video editor,
              VideoEditor offers a wide range of powerful features, including
              trimming and merging clips, applying visual effects and filters,
              adjusting colors and saturation, adding text and subtitles, and
              even incorporating transitions and music. With its real-time
              preview and intuitive timeline editor, VideoEditor makes the
              process of editing videos seamless and enjoyable. Transform your
              raw footage into captivating visual stories with VideoEditor, the
              ultimate online video editing solution.
            </p>
            <button className='w-full self-center rounded-xl bg-contrast p-2 text-xl text-text'>
              Try It Yourself
            </button>
          </div>
          <div className='flex h-[50vh] w-full lg:w-1/2 items-center justify-center rounded-xl bg-gray-600'>
            <span>VideoEditor preview</span>
          </div>
        </div>
      </div>
    </div>
  );
}
