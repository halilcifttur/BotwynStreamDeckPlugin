using StreamDeckLib;
using StreamDeckLib.Messages;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace BotwynStreamDeckPlugin
{
    [ActionUuid(Uuid = "com.elongef.botwyn.plugin")]
    public class BotwynStreamDeckPluginAction : BaseStreamDeckActionWithSettingsModel<Models.CounterSettingsModel>
    {
        private const int DECREASE_COUNTER_KEYPRESS_LENGTH = 600;
        private DateTime keyPressStart;
        private bool longKeyPressed = false;

        public override async Task OnKeyDown(StreamDeckEventPayload args)
        {
            keyPressStart = DateTime.Now;
            longKeyPressed = false;
        }

        public override async Task OnKeyUp(StreamDeckEventPayload args)
        {
            var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            path = Path.Combine(path, "Botwyn Death Counter");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);

            path = Path.Combine(path, "Botwyn_Death_Counter.txt");

            int timeKeyWasPressed = (int)(DateTime.Now - keyPressStart).TotalMilliseconds;
            if (timeKeyWasPressed < DECREASE_COUNTER_KEYPRESS_LENGTH)
            {
                SettingsModel.Total++;
                SettingsModel.Character++;
                await Manager.SetTitleAsync(args.context, $"{SettingsModel.Character} - {SettingsModel.Total}");

                File.WriteAllText(path, $"{SettingsModel.CharacterString}: {SettingsModel.Character} - {SettingsModel.TotalString}: {SettingsModel.Total}");

                await Manager.SetSettingsAsync(args.context, SettingsModel);

                await GetAsync(SettingsModel.IncrementApiURL);
            }
            else if (!longKeyPressed && timeKeyWasPressed >= DECREASE_COUNTER_KEYPRESS_LENGTH)
            {
                longKeyPressed = true;
                SettingsModel.Total--;
                SettingsModel.Character--;
                await Manager.SetTitleAsync(args.context, $"{SettingsModel.Character} - {SettingsModel.Total}");

                File.WriteAllText(path, $"{SettingsModel.CharacterString}: {SettingsModel.Character} - {SettingsModel.TotalString}: {SettingsModel.Total}");

                await Manager.SetSettingsAsync(args.context, SettingsModel);

                await GetAsync(SettingsModel.DecrementApiURL);
            }
        }

        public override async Task OnDidReceiveSettings(StreamDeckEventPayload args)
        {
            var folderPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            folderPath = Path.Combine(folderPath, "Botwyn Death Counter");
            if (Directory.Exists(folderPath))
            {
                var filePath = Path.Combine(folderPath, "Botwyn_Death_Counter.txt");
                var text = File.ReadAllText(filePath);
                var splitted = text.Split(" - ");
                var characterCount = splitted[0];
                var totalCount = splitted[1];
                var character = characterCount.Split(": ");
                var total = totalCount.Split(": ");

                await base.OnDidReceiveSettings(args);
                await Manager.SetTitleAsync(args.context, $"{Int32.Parse(character[1])} - {Int32.Parse(total[1])}");
            }
            else
            {
                await base.OnDidReceiveSettings(args);
                await Manager.SetTitleAsync(args.context, $"{SettingsModel.Character} - {SettingsModel.Total}");
            }
        }

        public override async Task OnWillAppear(StreamDeckEventPayload args)
        {
            var folderPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            folderPath = Path.Combine(folderPath, "Botwyn Death Counter");
            if (Directory.Exists(folderPath))
            {
                var filePath = Path.Combine(folderPath, "Botwyn_Death_Counter.txt");
                var text = File.ReadAllText(filePath);
                var splitted = text.Split(" - ");
                var characterCount = splitted[0];
                var totalCount = splitted[1];
                var character = characterCount.Split(": ");
                var total = totalCount.Split(": ");

                await base.OnWillAppear(args);
                await Manager.SetTitleAsync(args.context, $"{Int32.Parse(character[1])} - {Int32.Parse(total[1])}");
            }
            else
            {
                await base.OnWillAppear(args);
                await Manager.SetTitleAsync(args.context, $"{SettingsModel.Character} - {SettingsModel.Total}");
            }
        }

        public async Task<string> GetAsync(string uri)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            request.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

            using (HttpWebResponse response = (HttpWebResponse)await request.GetResponseAsync())
            using (Stream stream = response.GetResponseStream())
            using (StreamReader reader = new StreamReader(stream))
            {
                return await reader.ReadToEndAsync();
            }
        }

    }
}
