import VideoPlayer from './components/player/VideoPlayer';

const App = () => {
  const hlsUrl = 'http://localhost:8000/media/output/thelostboys/master.m3u8';
  const slug = 'thelostboys';

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#000' }}>
      <VideoPlayer src={hlsUrl} slug={slug} />
    </div>
  );
};

export default App;