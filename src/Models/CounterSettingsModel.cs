namespace BotwynStreamDeckPlugin.Models
{
    public class CounterSettingsModel
    {
        public int Total { get; set; } = 0;
        public int Character { get; set; } = 0;
        public string IncrementApiURL { get; set; }
        public string DecrementApiURL { get; set; }
        public string CharacterPrefix { get; set; }
        public string TotalPrefix { get; set; }
        public bool IsTotalActive { get; set; }
    }
}
