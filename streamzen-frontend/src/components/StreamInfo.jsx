import { useRemoteParticipant } from "@livekit/components-react";

function StreamInfo({ streamerIdentity }) {
  console.log(useRemoteParticipant);
  const participant = useRemoteParticipant(streamerIdentity);
  console.log(participant);
  return (
    <div className="space-y-6 border-t px-8 py-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="grid place-items-center relative">
            {participant && (
              <div className="absolute z-10 h-11 w-11 animate-ping rounded-full bg-red-600 dark:bg-red-400" />
            )}
            <img
              className={`z-20 h-16 w-16 rounded-full border-2 border-white bg-gray-500 dark:border-zinc-900
            ${participant && "ring-2 ring-red-600"}`}
              src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${streamerIdentity}&size=64&face=smile,cute`}
              alt={streamerIdentity}
            />
            {participant && (
              <div className="absolute z-30 mt-14 w-12 rounded-xl border-2 border-white bg-red-600 p-1 text-center text-xs font-bold uppercase text-white transition-all dark:border-zinc-900">
                Live
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">{streamerIdentity}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreamInfo;
