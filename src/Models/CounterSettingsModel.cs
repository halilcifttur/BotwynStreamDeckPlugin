namespace BotwynStreamDeckPlugin.Models
{
    public class CounterSettingsModel
    {
        public int Total { get; set; } = 0;
        public int Character { get; set; } = 0;
        public string IncrementApiURL { get; set; }
        public string DecrementApiURL { get; set; }
        public string CharacterString { get; set; }
        public string TotalString { get; set; }
    }
}
